"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionCreateListener = void 0;
const tslib_1 = require("tslib");
const DiscordListener_1 = require("../DiscordListener");
const fs_1 = tslib_1.__importDefault(require("fs"));
const OrganizerUpdate_1 = require("../buttons/OrganizerUpdate");
const InteractionCreateEmbeds_1 = require("../embeds/InteractionCreateEmbeds");
class InteractionCreateListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        const nonReplyButtonIds = ["teamcfgGold", "teamcfgSilver", "teamcfgBronze", "teamcfgTrue", "teamcfgFalse"];
        const buttonCache = JSON.parse(fs_1.default.readFileSync("./cache/persistentButtons.json", "utf-8"));
        for (const buttonId of buttonCache) {
            if (buttonId.startsWith("matchOrganizerUpdate")) {
                const btn = new OrganizerUpdate_1.MatchOrganizerUpdateButton(parseInt(buttonId.replace("matchOrganizerUpdate", "")));
                teamBot.persistentButtons.set(btn.id, btn);
            }
        }
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
                    if (nonReplyButtonIds.includes(interaction.customId)) {
                        interaction.deferUpdate();
                        return;
                    }
                    interaction.deferReply();
                    setTimeout(() => {
                        if (!interaction.replied) {
                            interaction.followUp({ embeds: [new InteractionCreateEmbeds_1.MisunderstoodButtonEmbed(interaction.customId)], ephemeral: true });
                            return;
                        }
                    }, 10_000);
                }
                teamBot.persistentButtons.get(interaction.customId)?.execute(teamBot, teamBot.client, interaction);
            }
        });
    }
}
exports.InteractionCreateListener = InteractionCreateListener;
//# sourceMappingURL=InteractionCreateListener.js.map