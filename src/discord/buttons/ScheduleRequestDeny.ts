import { Client, ButtonInteraction, CacheType, ButtonStyle } from "discord.js";
import { DiscordButton } from "../DiscordButton";
import { TeamBot } from "../../Bot";

export class ScheduleRequestDenyButton extends DiscordButton {
    public id: string;

    constructor() {
        super();
        this.id = "schedreqDeny";
        this.setLabel("Decline");
        this.setStyle(ButtonStyle.Danger);
        this.setCustomId(this.id);
    }

    async execute(teamBot: TeamBot, client: Client<boolean>, interaction: ButtonInteraction<CacheType>) {
        const schedReq = await teamBot.prisma.scheduleRequest.findFirst({
            where: { OR: [{ captainMsgId: interaction.message.id }, { coCaptainMsgId: interaction.message.id }] },
            include: {
                requesterTeam: {
                    select: {
                        players: {
                            where: { OR: [{ isCaptain: true }, { isCoCap: true }] },
                            select: { playerId: true },
                        },
                    },
                },
                receiverTeam: {
                    select: { name: true },
                },
            },
        });

        teamBot.prisma.scheduleRequest
            .delete({
                where: { id: schedReq?.id },
            })
            .then(() => {
                teamBot.prisma.$disconnect();
            });

        teamBot.client.users.send(schedReq?.requesterTeam.players[0].playerId!, `The schedule request against ${schedReq?.receiverTeam.name} has been denied`);
        teamBot.client.users.send(schedReq?.requesterTeam.players[1].playerId!, `The schedule request against ${schedReq?.receiverTeam.name} has been denied`);
    }
    
}
