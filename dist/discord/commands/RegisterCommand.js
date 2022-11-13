"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
class RegisterCommand extends DiscordCommand_1.DiscordCommand {
    inDev = true;
    constructor() {
        super();
        this.properties
            .setName("register")
            .setDescription("registers player and/or team")
            .addStringOption(new discord_js_1.SlashCommandStringOption().setName("oculusid").setDescription("your oculus username in exact casing"));
    }
    async executeInteraction(client, interaction) {
        const optionResponse = interaction.options.get("oculusid")?.value;
        if (optionResponse.includes(" ")) {
            return interaction.reply("Invalid Username: Oculus usernames cannot have spaces.");
        }
        if (interaction.options.get("oculusid")?.value) {
            const registeredPlayers = JSON.parse(fs_1.default.readFileSync("./db/registeredPlayers.json", "utf-8"));
            const PCLPLayer = registeredPlayers.find((PCLPlayer) => {
                return PCLPlayer.discordID === interaction.user.id;
            });
            if (PCLPLayer) {
                const index = registeredPlayers.indexOf(PCLPLayer);
                if (PCLPLayer.oculusId != optionResponse) {
                    registeredPlayers[index].oculusId = optionResponse;
                    fs_1.default.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                    await interaction.reply("Your oculus username has been updated successfully");
                }
                else {
                    await interaction.reply("No need to re-register, you are already registered as " + optionResponse);
                }
            }
            else {
                registeredPlayers.push({ discordID: interaction.user.id, oculusId: optionResponse, isCaptain: undefined, isCoCap: undefined, team: undefined });
                fs_1.default.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                await interaction.reply("Sucessfully registered");
            }
        }
    }
}
exports.default = RegisterCommand;
//# sourceMappingURL=RegisterCommand.js.map