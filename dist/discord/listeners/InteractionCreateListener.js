"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCreateListener = void 0;
const DiscordListener_1 = require("../DiscordListener");
class InteractionCreateListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("interactionCreate", (interaction) => {
            try {
                if (interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.InteractionCreateListener = InteractionCreateListener;
//# sourceMappingURL=InteractionCreateListener.js.map