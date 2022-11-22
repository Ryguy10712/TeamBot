"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const DiscordCommand_1 = require("../DiscordCommand");
const Embeds = tslib_1.__importStar(require("../embeds/DeleteTeamEmbeds"));
class DeleteTeamCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties
            .setName("delete_team")
            .setDescription("deletes your team... forever");
    }
    executeInteraction(client, interaction, teamBot) {
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const team = registeredTeams.find(pclTeam => pclTeam.captain === interaction.user.id);
        if (!team)
            return interaction.reply({ embeds: [Embeds.NotCaptainError] });
        registeredTeams.splice(registeredTeams.indexOf(team), 1);
        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
        interaction.reply({ embeds: [Embeds.Success] });
    }
}
exports.default = DeleteTeamCommand;
//# sourceMappingURL=DeleteTeamCommand.js.map