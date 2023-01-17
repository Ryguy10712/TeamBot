import { Client, CommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import { UserNotOnTeamEmbed } from "../embeds/CommonEmbeds";

export default class TeamInfoCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties.setName("team_info").setDescription("Shows your team's information");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const issuerTeam = await teamBot.prisma.team.findFirst({
            where: { players: { some: { playerId: interaction.user.id } } },
            include: { players: { select: { playerId: true, isCaptain: true, isCoCap: true, player: { select: { oculusId: true } } } } },
        });
        if (!issuerTeam) {
            interaction.reply({ embeds: [new UserNotOnTeamEmbed()], ephemeral: true });
            return;
        }
        //at this point the user is on a team
        let description: string = "";
        const TeamInfoEmbed = new EmbedBuilder().setTitle(`${issuerTeam.name}:`).setColor("Blue");
        for (const player of issuerTeam.players) {
            if (!player.player?.oculusId) {
                const username = (await client.users.fetch(player.playerId)).username;
                description += `-${username}, (Unregistered)\n`;
            } else {
                description += `-${player.player.oculusId}\n`;
            }
        }
        TeamInfoEmbed.setDescription(description);
        //setting captain
        const captain = issuerTeam.players.find((player) => {
            return player.isCaptain;
        });
        if (captain) {
            TeamInfoEmbed.addFields({
                name: "Captain:",
                value: captain.player?.oculusId!,
                inline: true,
            });
        }
        //setting co cap
        const coCap = issuerTeam.players.find((player) => {
            return player.isCoCap;
        });
        if (coCap) {
            if (coCap.player?.oculusId) {
                TeamInfoEmbed.addFields({ name: "Co-Captain:", value: coCap.player.oculusId, inline: true });
            } else {
                //co captain isn't registered
                const coCapUsername = (await client.users.fetch(coCap.playerId)).username;
                TeamInfoEmbed.addFields({ name: "Co-Captain:", value: `${coCapUsername} (Unregistered)`, inline: true });
            }
        } else {
            TeamInfoEmbed.addFields({ name: "Co-Captain:", value: "None", inline: true });
        }
        //setting rank
        switch (issuerTeam.rank) {
            case 0:
                TeamInfoEmbed.addFields({ name: "Rank:", value: "Gold", inline: true });
                break;
            case 1:
                TeamInfoEmbed.addFields({ name: "Rank:", value: "Silver", inline: true });
                break;
            case 2:
                TeamInfoEmbed.addFields({ name: "Rank:", value: "Bronze", inline: true });
                break;
            default:
                TeamInfoEmbed.addFields({ name: "Rank:", value: "Unranked", inline: true });
                break;
        }
        //set scheduling channel
        if (issuerTeam.schedulingChannel === null) {
            TeamInfoEmbed.addFields({ name: "Scheduling Channel:", value: "None", inline: true });
        } else {
            TeamInfoEmbed.addFields({ name: "Scheduling Channel:", value: `<#${issuerTeam.schedulingChannel}>`, inline: true });
        }
        //setting confidentiality
        if (issuerTeam.confidential) TeamInfoEmbed.addFields({ name: "Confidential?", value: "Yes", inline: true });
        else TeamInfoEmbed.addFields({ name: "Confidential?", value: "No", inline: true });
        interaction.reply({ embeds: [TeamInfoEmbed], ephemeral: true });
    }
}
