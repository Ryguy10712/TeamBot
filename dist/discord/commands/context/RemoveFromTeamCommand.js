"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFromTeamCommand = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordContextMenu_1 = require("../../DiscordContextMenu");
const CommonEmbeds_1 = require("../../embeds/CommonEmbeds");
const fs_1 = tslib_1.__importDefault(require("fs"));
const AddToTeamEmbeds_1 = require("../../embeds/AddToTeamEmbeds");
class RemoveFromTeamCommand extends DiscordContextMenu_1.DiscordContextMenu {
    inDev;
    constructor() {
        super();
        this.inDev = true;
        this.properties.setName("Remove from team").setType(discord_js_1.ApplicationCommandType.User);
    }
    async executeInteraction(client, interaction, teamBot) {
        const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.players.includes(interaction.user.id);
        });
        if (!issuerTeam)
            return interaction.reply({ embeds: [new CommonEmbeds_1.UserNotOnTeamEmbed()], ephemeral: true });
        if (issuerTeam.captain != interaction.user.id && issuerTeam.coCap != interaction.user.id) {
            interaction.reply({ embeds: [new CommonEmbeds_1.UserNotCaptainEmbed()], ephemeral: true });
            return;
        }
        if (!issuerTeam.players.includes(interaction.targetId)) {
            interaction.reply({ embeds: [new CommonEmbeds_1.PlayerNotOnUserTeamEmbed()], ephemeral: true });
            return;
        }
        issuerTeam.players.splice(issuerTeam.players.indexOf(interaction.targetId), 1);
        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        interaction.reply({ embeds: [new AddToTeamEmbeds_1.PlayerRemoveSuccess], ephemeral: true });
    }
}
exports.RemoveFromTeamCommand = RemoveFromTeamCommand;
//# sourceMappingURL=RemoveFromTeamCommand.js.map