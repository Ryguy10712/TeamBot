"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const Embeds = tslib_1.__importStar(require("../embeds/TeamConfigEmbeds"));
const Components = tslib_1.__importStar(require("../components/TeamConfigComponents"));
class TeamConfigCommand extends DiscordCommand_1.DiscordCommand {
    inDev = true;
    constructor() {
        super();
        this.properties.setName("team_config").setDescription("Edit various team preferences");
    }
    async executeInteraction(client, interaction, teamBot) {
        if (!teamBot.findPCLPlayerByDiscord(interaction.user.id))
            return interaction.reply({ embeds: [Embeds.NotRegisteredError] });
        if (!teamBot.findTeamByCoCap(interaction.user.id))
            return interaction.reply({ embeds: [Embeds.NoTeamError] });
        const reply = await interaction.reply({ components: [new Components.TeamConfigRow(0)], embeds: [Embeds.AddPlayerEmbed] });
        const filter = (i) => {
            if (i.deferred || i.customId != "teamcfgMenu")
                return false;
            i.deferUpdate();
            return i.user == interaction.user;
        };
        const collector = reply.createMessageComponentCollector({ filter: filter, componentType: discord_js_1.ComponentType.StringSelect, time: 5000 });
        collector.on("collect", (menuInteraction) => {
            switch (menuInteraction.values[0]) {
                case "addPlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(0), Components.RemovePlayerButton], embeds: [Embeds.AddPlayerEmbed] });
                    break;
                case "removePlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(1), Components.RemovePlayerButton], embeds: [Embeds.RemovePlayerEmbed] });
                    break;
                case "editName":
                    interaction.editReply({ components: [new Components.TeamConfigRow(2), Components.EditButton], embeds: [Embeds.EditNameEmbed] });
                    break;
                case "confidential":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(3), Components.ConfidentialityButtons],
                        embeds: [Embeds.ConfidentialityEmbed],
                    });
                    break;
            }
        });
        collector.on("end", async () => {
            if (collector.endReason != "time")
                return;
            interaction.followUp("Timed out");
        });
    }
}
exports.default = TeamConfigCommand;
//# sourceMappingURL=TeamConfigCommand.js.map