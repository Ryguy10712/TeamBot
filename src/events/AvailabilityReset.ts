import cron, { ScheduledTask } from "node-cron";
import { TeamBot } from "../Bot";
import { DiscordAPIError, GuildTextBasedChannel, userMention } from "discord.js";
import { PrismaClient, Team, TeamAvailability } from "@prisma/client";
import { DayOfWeek } from "../types";

type TeamAndAvailability = Team & {
    availability: TeamAvailability | null;
};

async function deleteTeamAvailabilityInfo(prisma: PrismaClient, teamId: number): Promise<boolean> {
    //this removes info for the entire team
    try {
        await prisma.teamPlayer.updateMany({
            where: { teamId: teamId },
            data: {
                tuesday: {},
                wednesday: {},
                thursday: {},
                friday: {},
                saturday: {},
                sunday: {},
                monday: {},
            },
        });
        await prisma.$disconnect();
        await prisma.team.update({
            where: { id: teamId },
            data: {
                availability: { delete: true },
                schedulingChannel: null,
            },
        });
        await prisma.$disconnect();
        return true;
    } catch {
        return false;
    }
}

async function checkSchedulingChannel(team: TeamAndAvailability, teamBot: TeamBot): Promise<GuildTextBasedChannel | null> {
    try {
        const schedulingChannel = (await teamBot.client.channels.fetch(team.schedulingChannel!)) as GuildTextBasedChannel;
        if (!schedulingChannel.viewable) {
            throw null;
        }
        return schedulingChannel;
    } catch {
        return null;
    }
}

async function attemptRemoveReactions(team: TeamAndAvailability, channel: GuildTextBasedChannel, day: DayOfWeek, teamBot: TeamBot): Promise<boolean | DiscordAPIError> {
    try {
        const msg = await channel!.messages.fetch(team.availability![day]);
        const reactions = msg.reactions.valueOf().values();
        for (const reaction of reactions) {
            const users = await reaction.users.fetch();
            for (const user of users.values()) {
                if (user.id != teamBot.client.user!.id) {
                    reaction.users.remove(user.id);
                }
            }
        }
        return true;
    } catch (err) {
        return err as DiscordAPIError;
    }
}

export function initReactionResetHandle(teamBot: TeamBot): ScheduledTask {
    // 0 0 * * 2
    return cron.schedule("0 0 * * 1", async function () {
        const days: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const teams = await teamBot.prisma.team.findMany({
            where: { NOT: { schedulingChannel: null } },
            include: { availability: true },
        });
        console.log("Resetting reactions");

        for (const team of teams) {
            const channel = await checkSchedulingChannel(team, teamBot);
            if (!channel) {
                teamBot.log(`Could not find scheduling channel for (${team.name})`, false);
                const captain = await teamBot.prisma.teamPlayer.findFirst({
                    where: { teamId: team.id, isCaptain: true },
                });
                const captainDiscord = await teamBot.client.users.fetch(captain!.playerId);
                captainDiscord.send("When resetting reactions, I could not find your scheduling channel. It is no longer tracked and you must set a new one.");
                deleteTeamAvailabilityInfo(teamBot.prisma, team.id);
                return;
            }

            let reactionRemoveStatus: boolean | DiscordAPIError = true; //this will be marked false the bot fails to fetch a single message
            for (const day of days) {
                if (reactionRemoveStatus == false) {
                    return;
                }

                if (reactionRemoveStatus instanceof DiscordAPIError) {
                    if (reactionRemoveStatus.message == "Missing Access") {
                        teamBot.log(`Could not access messages for ${team.name}`, false);
                        const captain = await teamBot.prisma.teamPlayer.findFirst({
                            where: { isCaptain: true, teamId: team.id },
                        });
                        const user = await teamBot.client.users.fetch(captain?.playerId!);
                        user.send(
                            "TeamBot had trouble accessing one or more messages in your scheduling channel. The channel is no longer tracked and you will have to set a new one."
                        );
                        deleteTeamAvailabilityInfo(teamBot.prisma, team.id);
                        reactionRemoveStatus = false;
                        return;
                    }
                }
                reactionRemoveStatus = await attemptRemoveReactions(team, channel, day, teamBot);
                console.log("done");
            }
            teamBot.prisma.teamPlayer.updateMany({
                where: {teamId: team.id},
                data: {
                    tuesday: {},
                    wednesday: {},
                    thursday: {},
                    friday: {},
                    saturday: {},
                    sunday: {},
                    monday: {}
                }
            }).then(() => {
                teamBot.prisma.$disconnect()
            })
            teamBot.log(`done with ${team.name}`, false)
        }
    });
}
