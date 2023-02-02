import cron from "node-cron";
import { TeamBot } from "../Bot";
import { DiscordAPIError, GuildTextBasedChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { DayOfWeek } from "../typings";

export async function AvailabilityReset(teamBot: TeamBot) {
    // 0 0 * * 2
    cron.schedule("0 0 * * 2", async function () {
        const days: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
        const teams = await teamBot.prisma.team.findMany({
            where: { NOT: { schedulingChannel: null }, name: "Divine" },
            include: { availability: true },
        });
        for (const team of teams) {
            let schedulingChannel: GuildTextBasedChannel;
            try {
                schedulingChannel = (await teamBot.client.channels.fetch(team.schedulingChannel!)) as GuildTextBasedChannel;
                if (!schedulingChannel.viewable) {
                    throw null;
                }
            } catch (err) {
                teamBot.log(`Could not find scheduling channel for (${team.name})`, false);
                const captain = await teamBot.prisma.teamPlayer.findFirst({
                    where: { teamId: team.id, isCaptain: true },
                });
                const captainDiscord = await teamBot.client.users.fetch(captain!.playerId);
                captainDiscord.send("When resetting reactions, I could not find your scheduling channel. It is no longer tracked and you must set a new one.");
                deleteAvailabilityInfo(teamBot.prisma, team.id);
                return;
            }
            let dayFailed = false; //this will be marked true the bot fails to fetch a single message
            for (const day of days) {
                try {
                    if (dayFailed) return;
                    const msg = await schedulingChannel!.messages.fetch(team.availability![day]);
                    const reactions = msg.reactions.valueOf().values();
                    for (const reaction of reactions) {
                        reaction.users.fetch().then((reactionUsers) => {
                            for (const user of reactionUsers.values()) {
                                if (user.id != teamBot.client.user!.id) {
                                    reaction.users.remove(user.id);
                                }
                            }
                        });
                    }
                    teamBot.prisma.teamPlayer
                        .updateMany({
                            where: { teamId: team.id },
                            data: {
                                tuesday: {},
                                wednesday: {},
                                thursday: {},
                                friday: {},
                                saturday: {},
                                sunday: {},
                                monday: {},
                            },
                        })
                        .then(() => {
                            teamBot.prisma.$disconnect();
                        });
                } catch (err: any) {
                    dayFailed = true;
                    if (err instanceof DiscordAPIError) {
                        console.log(err.message);
                        if (err.message == "Missing Access") {
                            console.log(err.cause);
                            const captain = await teamBot.prisma.teamPlayer.findFirst({
                                where: { isCaptain: true, teamId: team.id },
                            });
                            const user = await teamBot.client.users.fetch(captain?.playerId!);
                            user.send(
                                "TeamBot had trouble accessing one or more messages in your scheduling channel. The channel is no longer tracked and you will have to set a new one."
                            );
                            deleteAvailabilityInfo(teamBot.prisma, team.id);
                        }
                    }
                }
            }
        }
    });
}

async function deleteAvailabilityInfo(prisma: PrismaClient, teamId: number): Promise<boolean> {
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
