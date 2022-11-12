"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordCommand = void 0;
const discord_js_1 = require("discord.js");
class DiscordCommand {
    properties;
    constructor() {
        this.properties = new discord_js_1.SlashCommandBuilder();
    }
}
exports.DiscordCommand = DiscordCommand;
//# sourceMappingURL=DiscordCommand.js.map