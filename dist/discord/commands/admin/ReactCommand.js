"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCommand = void 0;
const DiscordCommand_1 = require("../../DiscordCommand");
class ReactCommand extends DiscordCommand_1.DiscordCommand {
    inDev = true;
    constructor() {
        super();
        this.properties;
    }
    executeInteraction(client, interaction, teamBot) {
    }
}
exports.ReactCommand = ReactCommand;
//# sourceMappingURL=ReactCommand.js.map