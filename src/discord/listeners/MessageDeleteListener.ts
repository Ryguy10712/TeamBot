import { TeamBot } from "../../Bot"
import { DiscordListener } from "../DiscordListener"

export class MessageDeleteListener extends DiscordListener{
    startListener(teamBot: TeamBot) {
        teamBot.client.on("messageDelete", (message) => {
            teamBot.prisma.teamAvailability.findFirst({
                where: {
                    OR: [
                        {tuesday: message.id},
                        {wednesday: message.id},
                        {thursday: message.id},
                        {friday: message.id},
                        {saturday: message.id},
                        {sunday: message.id},
                        {monday: message.id}
                    ]
                },
                include: {
                    team: {
                        include: {
                            players: true
                        }
                    }
                }
            })
            .then((availability) => {
                if(!availability) return;
                const captainId  = availability.team.players.find(player => {
                    return player.isCaptain
                })!.playerId
                 teamBot.client.users.fetch(captainId)
                .then((captainUser) => {
                    captainUser.send("Looks like you deleted one of my messages in your scheduling channel. TeamBot will no longer track this channel and it is encouraged that you reset it.")
                    teamBot.prisma.teamAvailability.delete({
                        where: {teamId: availability.teamId}
                    }).then(() => {teamBot.prisma.$disconnect()})
                    teamBot.prisma.team.update({
                        where: {id: availability.teamId},
                        data: {schedulingChannel: null}
                    }).then(() => {teamBot.prisma.$disconnect()})
                    teamBot.prisma.scheduleRequest.deleteMany({
                        where: {OR: [{requesterId: availability.teamId}, {receiverId: availability.teamId}]}
                    })
                    for(const player of availability.team.players){
                        teamBot.prisma.teamPlayer.update({
                            where: {playerId: player.playerId},
                            data: {
                                monday: {}, tuesday: {}, wednesday: {},
                                thursday: {}, friday: {}, saturday: {},
                                sunday: {}
                            }
                        }).then(() => {teamBot.prisma.$disconnect()})
                    }
                })
            })
        })
    }
}