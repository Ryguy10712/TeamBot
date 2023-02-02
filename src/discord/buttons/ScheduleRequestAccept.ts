import { Client, ButtonInteraction, CacheType, GuildTextBasedChannel, ButtonStyle, DMChannel } from "discord.js";
import { DiscordButton } from "../DiscordButton";
import { MatchOrganizerEmbed, UpdateButtonRow } from "../components/RequestAcceptComponents";
import { RequestRow } from "../components/ScheduleRequestComponents";
import { TeamBot } from "../../Bot";
import { MatchType } from "../../types";

export class ScheduleRequestAcceptButton extends DiscordButton {
    public id: string;

    constructor() {
        super();
        this.id = "schedreqAccept";
        this.setLabel("Accept");
        this.setStyle(ButtonStyle.Success);
        this.setCustomId(this.id);
    }

    async execute(teamBot: TeamBot, client: Client<boolean>, interaction: ButtonInteraction<CacheType>) {
        await interaction.deferUpdate(); //prevents failed msg
        const schedReq = await teamBot.prisma.scheduleRequest.findFirst({
            where: { OR: [{ captainMsgId: interaction.message.id }, { coCaptainMsgId: interaction.message.id }] },
            include: {
                receiverTeam: {
                    select: {
                        players: {
                            where: { OR: [{ isCaptain: true }, { isCoCap: true }] },
                        },
                        schedulingChannel: true,
                        name: true,
                    },
                },
                requesterTeam: {
                    select: {
                        players: {
                            where: { OR: [{ isCaptain: true }, { isCoCap: true }] },
                        },
                        schedulingChannel: true,
                        name: true,
                    },
                },
            },
        });

        if (!schedReq) return interaction.reply("this schedule request is no longer available");

        const requesterCaptainId = schedReq.requesterTeam.players.find((player) => {
            return player.isCaptain;
        })!.playerId;
        const requesterCoCapId = schedReq.requesterTeam.players.find((player) => {
            return player.isCoCap;
        })?.playerId;
        const requesterCaptainUser = await client.users.fetch(requesterCaptainId);
        const requesterCoCaptainUser = requesterCoCapId ? await client.users.fetch(requesterCoCapId) : null;

        //time for the beef

        try {
            const requesterSchedulingChan = (await client.channels.fetch(schedReq.requesterTeam.schedulingChannel!)) as GuildTextBasedChannel;

            const accepeterSchedulingChan = (await client.channels.fetch(schedReq.receiverTeam.schedulingChannel!)) as GuildTextBasedChannel;

            //let requester captain know
            requesterCaptainUser.send(`The ${MatchType[schedReq.type]} against ${schedReq.receiverTeam.name} has been accepted`);
            //disable the buttons
            interaction.message.edit({ components: [new RequestRow(false)] }).catch(async (e) => {
                const chan = (await client.channels.fetch(interaction.message.channelId)) as DMChannel;
                const mess = await chan.messages.fetch(interaction.message.id);
                mess.edit({ components: [new RequestRow(false)] });
            });
            //if applicable, let requester coCap know
            if (requesterCoCaptainUser) requesterCoCaptainUser.send(`The ${MatchType[schedReq.type]} against ${schedReq.receiverTeam.name} has been accepted`);

            requesterSchedulingChan.send({
                embeds: [new MatchOrganizerEmbed(schedReq.requesterTeam, schedReq.receiverTeam, schedReq.type)],
                components: [new UpdateButtonRow(schedReq.id, teamBot)],
            });
            accepeterSchedulingChan.send({
                embeds: [new MatchOrganizerEmbed(schedReq.receiverTeam, schedReq.requesterTeam, schedReq.type)],
                components: [new UpdateButtonRow(schedReq.id, teamBot)],
            });
            await teamBot.prisma.scheduleRequest.update({
                where: {id: schedReq.id},
                data: {
                    accepted: true
                }
            })
            await teamBot.prisma.$disconnect()
            teamBot.prisma.persistantButtons
                .create({
                    data: { id: `matchOrganizerUpdate${schedReq.id}` },
                })
                .then(() => {
                    teamBot.prisma.$disconnect();
                });
        } catch (e: any) {
            interaction.followUp("There was an unexpected error and the schedule request has been terminated");
            teamBot.prisma.scheduleRequest
                .delete({
                    where: { id: schedReq.id },
                })
                .then(() => {
                    teamBot.prisma.$disconnect();
                });
        }
    }
}
