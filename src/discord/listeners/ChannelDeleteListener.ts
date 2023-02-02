import { ChannelType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DayOfWeek } from "../../typings";
import { DiscordListener } from "../DiscordListener";

export class ChannelDeleteListener extends DiscordListener {
    async startListener(teamBot: TeamBot) {
        teamBot.client.on("channelDelete", async (channel) => {
            if (channel.type != ChannelType.GuildText) {
                return;
            }
            const team = await teamBot.prisma.team.findFirst({
                where: { schedulingChannel: channel.id },
                select: {
                    id: true,
                    players: {
                        where: { OR: [{ isCaptain: true }, { isCoCap: true }] },
                    },
                },
            });
            if (!team) return;
            //reset availability for all players and remove teamAvailability table
            teamBot.prisma.teamAvailability
                .delete({
                    where: { teamId: team.id },
                })
                .then(() => {
                    teamBot.prisma.$disconnect();
                });

            const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
            for (const player of team.players) {
                teamBot.prisma.teamPlayer
                    .update({
                        where: { playerId: player.playerId },
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
            }
            const captain = team.players.find(player => {
                return player.isCaptain
            })!
            const coCap = team.players.find(player => {
                return player.isCoCap
            })
            
            teamBot.client.users.fetch(captain.playerId)
            .then((user) => {user.send("Looks like you deleted your scheduling channel. Availability for your team has been reset")})
            if(coCap){
                teamBot.client.users.fetch(coCap.playerId)
                .then((user) => {user.send("Looks like you deleted your scheduling channel. Availability for your team has been reset")})
            }
            
        });
    }
}
