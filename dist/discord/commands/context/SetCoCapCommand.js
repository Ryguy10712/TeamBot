"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCoCapCommand = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordContextMenu_1 = require("../../DiscordContextMenu");
const fs_1 = tslib_1.__importDefault(require("fs"));
const CommonEmbeds_1 = require("../../embeds/CommonEmbeds");
const SetCoCapEmbeds_1 = require("../../embeds/SetCoCapEmbeds");
class SetCoCapCommand extends DiscordContextMenu_1.DiscordContextMenu {
    inDev;
    constructor() {
        super();
        this.inDev = false;
        this.properties = new discord_js_1.ContextMenuCommandBuilder()
            .setType(discord_js_1.ApplicationCommandType.User).setName("Set as co-captain");
    }
    async executeInteraction(client, interaction, teamBot) {
        const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = teamsDb.find(pclTeam => {
            return pclTeam.captain == interaction.user.id || pclTeam.coCap == interaction.user.id;
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
        issuerTeam.coCap = interaction.targetId;
        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        interaction.reply({ embeds: [new SetCoCapEmbeds_1.CoCapSetEmbed], ephemeral: true });
    }
}
exports.SetCoCapCommand = SetCoCapCommand;
//# sourceMappingURL=SetCoCapCommand.js.map