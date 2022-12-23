"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToTeamCommand = void 0;
const discord_js_1 = require("discord.js");
const DiscordContextMenu_1 = require("../../DiscordContextMenu");
class AddToTeamCommand extends DiscordContextMenu_1.DiscordContextMenu {
    inDev;
    constructor() {
        super();
        this.inDev = true;
        this.properties = new discord_js_1.ContextMenuCommandBuilder()
            .setName("Add to team")
            .setType(discord_js_1.ApplicationCommandType.User);
    }
    executeInteraction(client, interaction, teamBot) {
        interaction.reply("Not yet implemented");
    }
}
exports.AddToTeamCommand = AddToTeamCommand;
//# sourceMappingURL=AddToTeamCommand.js.map