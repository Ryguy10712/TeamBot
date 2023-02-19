import { Client, ButtonInteraction, CacheType, ButtonStyle, DMChannel } from "discord.js";
import { DiscordButton } from "../DiscordButton";
import { TeamBot } from "../../Bot";
import { RequestRow } from "../components/ScheduleRequestComponents";
import { SchedReqState } from "@prisma/client";

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

        if (!schedReq) {
            interaction.reply("This schedule request is no longer available");
            interaction.message.edit({ components: [new RequestRow(false)] }).catch(async () => {
                const chan = (await client.channels.fetch(interaction.message.channelId)) as DMChannel;
                const mess = await chan.messages.fetch(interaction.message.id);
                mess.edit({ components: [new RequestRow(false)] });
            });
            return;
        }

        if (schedReq.state != "PENDING") {
            interaction.followUp({ content: `The schedule request has already been ${SchedReqState[schedReq.state].toLowerCase()}`, ephemeral: true });
            interaction.message.edit({ components: [new RequestRow(false)] }).catch(async () => {
                const mess = await interaction.message.fetch();
                mess.edit({ components: [new RequestRow(false)] });
            });
            return;
        }

        interaction.message.edit({ components: [new RequestRow(false)] }).catch(async () => {
            const mess = await interaction.message.fetch();
            mess.edit({ components: [new RequestRow(false)] });
        });

        teamBot.prisma.scheduleRequest
            .update({
                where: { id: schedReq?.id },
                data: {state: "DENIED"}
            })
            .then(() => {
                interaction.reply("Success")
                teamBot.prisma.$disconnect();
            });

        if (schedReq?.requesterTeam.players[0]) {
            teamBot.client.users.send(schedReq?.requesterTeam.players[0].playerId!, `The schedule request against ${schedReq?.receiverTeam.name} has been denied`);
        }
        if (schedReq?.requesterTeam.players[1]) {
            teamBot.client.users.send(schedReq?.requesterTeam.players[1].playerId!, `The schedule request against ${schedReq?.receiverTeam.name} has been denied`);
        }
    }
}
