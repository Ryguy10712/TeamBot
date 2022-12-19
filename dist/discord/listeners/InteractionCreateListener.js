"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCreateListener = void 0;
const DiscordListener_1 = require("../DiscordListener");
class InteractionCreateListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot);
                }
            }
            catch (e) {
                console.error(e);
            }
            if (interaction.isButton()) {
                if (!teamBot.persistentButtons.has(interaction.customId)) {
                    interaction.reply({ ephemeral: true, content: "I do not know how to handle this button" });
                    return;
                }
                teamBot.persistentButtons.get(interaction.customId)?.execute(teamBot, teamBot.client, interaction);
            }
        });
    }
}
exports.InteractionCreateListener = InteractionCreateListener;
//# sourceMappingURL=InteractionCreateListener.js.map