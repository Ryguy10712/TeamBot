"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongCommand = void 0;
const DiscordCommand_1 = require("../DiscordCommand");
class PongCommand extends DiscordCommand_1.DiscordCommand {
    inDev;
    constructor() {
        super();
        this.inDev = false;
        this.properties
            .setName("pong")
            .setDescription("replies with ping");
    }
    executeInteraction(client, interaction) {
        interaction.reply("Ping!");
    }
}
exports.PongCommand = PongCommand;
//# sourceMappingURL=PongCommand.js.map