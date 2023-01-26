import cron from "node-cron";
import { TeamBot } from "../Bot";
import { DayOfWeek } from "../interfaces/PCLTeam";
import { GuildTextBasedChannel, Message } from "discord.js";

export async function AvailabilityReset(teamBot: TeamBot) {
    // 0 0 * * 2
    cron.schedule("0 0 * * 2", async function () {
        //run every tuesday at 0:00 (12 AM)
        teamBot.log("cron job is running", false);
        const teams = await teamBot.prisma.teamAvailability.findMany({
            include: { team: { select: { schedulingChannel: true, players: true } } },
        });
        const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
        for (const team of teams) {
            await teamBot.prisma.teamPlayer.updateMany({
                where: { teamId: team.teamId },
                data: { tuesday: {}, wednesday: {}, thursday: {}, friday: {}, saturday: {}, sunday: {}, monday: {} },
            });
            teamBot.prisma.$disconnect();
            if (team.team.schedulingChannel) {
                const schedChan = (await teamBot.client.channels.fetch(team.team.schedulingChannel!)) as GuildTextBasedChannel;
                if (schedChan) {
                    for (const day of daysOfWeek) {
                        let mess: Message | null;
                        let failed = false;
                        try {
                            mess = await schedChan.messages.fetch(team[day]);
                        } catch (e) {
                            failed = true;
                            mess = null;
                            const captain = team.team.players.find((player) => {
                                return player.isCaptain;
                            });
                            const captainUser = await teamBot.client.users.fetch(captain!.playerId);
                            captainUser.send(
                                "TeamBot had trouble accessing my messages in your scheduling channel and it is now no longer tracked. Please set reset your scheduling channel"
                            );
                            teamBot.log(`stopped tracking ${team.teamId}'s scheduling channel`, false);
                            teamBot.prisma.team
                                .update({
                                    where: { id: team.teamId },
                                    data: { schedulingChannel: null },
                                })
                                .then(() => {
                                    teamBot.prisma.$disconnect();
                                });
                            teamBot.prisma.teamAvailability
                                .delete({
                                    where: { teamId: team.teamId },
                                })
                                .then(() => {
                                    teamBot.prisma.$disconnect();
                                });
                            teamBot.prisma.scheduleRequest
                                .deleteMany({
                                    where: { OR: [{ receiverId: team.teamId }, { receiverId: team.teamId }] },
                                })
                                .then(() => {
                                    teamBot.prisma.$disconnect();
                                });
                        }
                        if (mess && !failed) {
                            const reactions = mess.reactions.valueOf();
                            for (const i of reactions) {
                                const reaction = i[1];
                                reaction.users.fetch().then((reactionUsers) => {
                                    for (const reactionUser of reactionUsers) {
                                        const user = reactionUser[1];
                                        if (user.id != teamBot.client.user?.id) {
                                            reaction.users.remove(user);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });
}
