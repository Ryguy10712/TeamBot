import { ButtonInteraction, ButtonStyle, Client } from "discord.js";
import { DiscordButton } from "../DiscordButton";
import { MatchOrganizerEmbed } from "../components/RequestAcceptComponents";
import { TeamBot } from "../../Bot";
import { PrismaClient } from "@prisma/client";

export class MatchOrganizerUpdateButton extends DiscordButton {
    public id: string;
    constructor(scheduleRequestId: number, prisma: PrismaClient) {
        super();
        this.id = `matchOrganizerUpdate${scheduleRequestId}`;
        this.setLabel("Update");
        this.setStyle(ButtonStyle.Primary);
        this.setCustomId(this.id);
    }

    async execute(teamBot: TeamBot, client: Client, interaction: ButtonInteraction) {
        interaction.deferUpdate();
        const schedReqId = parseInt(interaction.customId.replace("matchOrganizerUpdate", ""));
        const schedReq = await teamBot.prisma.scheduleRequest.findFirst({
            where: { id: schedReqId },
            include: {
                receiverTeam: { select: { name: true, players: true, schedulingChannel: true } },
                requesterTeam: { select: { name: true, players: true, schedulingChannel: true } },
            },
        });

        if (!schedReq) return interaction.reply("this is no longer available");

        if (!schedReq.requesterTeam) return interaction.reply("There was an error fetching the requester's information");
        if (!schedReq.receiverTeam) return interaction.reply(`There was an error fetching the recievers information`);

        //find out which team this embed is for
        const homeTeam = schedReq.requesterTeam.schedulingChannel == interaction.channelId ? schedReq.requesterTeam : schedReq.receiverTeam;
        const awayTeam = homeTeam == schedReq.requesterTeam ? schedReq.receiverTeam : schedReq.requesterTeam;
        interaction.message.edit({ embeds: [new MatchOrganizerEmbed(homeTeam, awayTeam, schedReq.type)] });
    }
}
