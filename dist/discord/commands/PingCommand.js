"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const DiscordCommand_1 = require("../DiscordCommand");
class PingCommand extends DiscordCommand_1.DiscordCommand {
    inDev;
    constructor() {
        super();
        this.inDev = false;
        this.properties
            .setName("ping")
            .setDescription("replies with Pong!");
    }
    executeInteraction(client, interaction) {
        interaction.reply("Pong!");
    }
}
exports.PingCommand = PingCommand;
//# sourceMappingURL=PingCommand.js.map