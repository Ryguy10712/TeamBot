import cron from "node-cron";
import { TeamBot } from "../Bot";
import { DayOfWeek } from "../interfaces/PCLTeam";
import { GuildTextBasedChannel } from "discord.js";

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
            const schedChan = (await teamBot.client.channels.fetch(team.team.schedulingChannel!)) as GuildTextBasedChannel;
            if (!schedChan) break;
            for (const day of daysOfWeek) {
                teamBot.prisma.teamPlayer.updateMany({
                    where: { teamId: team.teamId },
                    data: { tuesday: {}, wednesday: {}, thursday: {}, friday: {}, saturday: {}, sunday: {}, monday: {} },
                })
                .then(() => {teamBot.prisma.$disconnect()})
                const reactions = (await schedChan.messages.fetch(team[day])).reactions.valueOf();
                for(const i of reactions){
                    const reaction = i[1]
                    reaction.users.fetch().then((reactionUsers) => {
                        for(const reactionUser of reactionUsers){
                            const user = reactionUser[1]
                            if(user.id != teamBot.client.user?.id){
                                reaction.users.remove(user)
                            }
                        }
                    })
                }
            }
        }
    });
}
