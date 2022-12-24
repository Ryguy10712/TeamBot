"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const fs_1 = tslib_1.__importDefault(require("fs"));
const DiscordCommand_1 = require("../DiscordCommand");
class TeamInfoCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties.setName("team_info").setDescription("Shows your team's information");
    }
    async executeInteraction(client, interaction, teamBot) {
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = registeredTeams.find(pclTeam => { return pclTeam.players.includes(interaction.user.id); });
        if (!issuerTeam) {
            const NoTeamEmbed = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("What team?").addFields({
                name: "Failed:",
                value: "You are not on any team"
            });
            return interaction.reply({ embeds: [NoTeamEmbed] });
        }
        let description = "";
        const TeamInfoEmbed = new discord_js_1.EmbedBuilder().setTitle(`${issuerTeam.name}:`).setColor("Blue");
        for (const player of issuerTeam.players) {
            const pclPlayer = teamBot.findPCLPlayerByDiscord(player);
            if (!pclPlayer?.oculusId) {
                const playerDiscord = await client.users.fetch(player);
                description += `-${playerDiscord.username} (Discord)\n`;
            }
            else {
                description += `-${pclPlayer.oculusId}\n`;
            }
        }
        TeamInfoEmbed.setDescription(description);
        TeamInfoEmbed.addFields({
            name: "Captain:",
            value: teamBot.findPCLPlayerByDiscord(issuerTeam.captain).oculusId,
            inline: true
        });
        if (issuerTeam.coCap) {
            TeamInfoEmbed.addFields({ name: "Co-Captain:", value: teamBot.findPCLPlayerByDiscord(issuerTeam.coCap).oculusId, inline: true });
        }
        else {
            TeamInfoEmbed.addFields({ name: "Co-Captain:", value: "None", inline: true });
        }
        switch (issuerTeam.rank) {
            case 0:
                TeamInfoEmbed.addFields({ "name": "Rank:", value: "Gold", inline: true });
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
        if (issuerTeam.schedulingChannel === null) {
            TeamInfoEmbed.addFields({ name: "Scheduling Channel:", value: "None", inline: true });
        }
        else {
            TeamInfoEmbed.addFields({ name: "Scheduling Channel:", value: `<#${issuerTeam.schedulingChannel}>`, inline: true });
        }
        if (issuerTeam.confidential)
            TeamInfoEmbed.addFields({ name: "Confidential?", value: "Yes", inline: true });
        else
            TeamInfoEmbed.addFields({ name: "Confidential?", value: "No", inline: true });
        interaction.reply({ embeds: [TeamInfoEmbed], ephemeral: true });
    }
}
exports.default = TeamInfoCommand;
//# sourceMappingURL=TeamInfoCommand.js.map