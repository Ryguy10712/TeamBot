"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
const Embeds = tslib_1.__importStar(require("../embeds/RegisterEmbeds"));
const StringSanatizers_1 = require("../../utils/StringSanatizers");
class RegisterCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties
            .setName("register")
            .setDescription("registers your oculus username")
            .addStringOption(new discord_js_1.SlashCommandStringOption().setName("oculusid").setDescription("your oculus username in exact casing").setRequired(true));
    }
    async executeInteraction(client, interaction) {
        const optionResponse = interaction.options.get("oculusid")?.value;
        if (!(0, StringSanatizers_1.isoculusidClean)(optionResponse)) {
            return interaction.reply({ embeds: [Embeds.InvalidIdError] });
        }
        if (interaction.options.get("oculusid")?.value) {
            const registeredPlayers = JSON.parse(fs_1.default.readFileSync("./db/registeredPlayers.json", "utf-8"));
            const PCLPLayer = registeredPlayers.find((PCLPlayer) => {
                return PCLPlayer.discordID === interaction.user.id;
            });
            if (registeredPlayers.some((PCLPLayer) => {
                return PCLPLayer.oculusId.toLowerCase() === optionResponse.toLowerCase();
            }))
                return interaction.reply({ embeds: [Embeds.UserNameExistsError] });
            if (PCLPLayer) {
                const index = registeredPlayers.indexOf(PCLPLayer);
                if (PCLPLayer.oculusId != optionResponse) {
                    registeredPlayers[index].oculusId = optionResponse;
                    fs_1.default.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                    await interaction.reply({
                        embeds: [Embeds.UpdateSuccess.setFields({ name: "Success:", value: `Your username has been updated to **${optionResponse}**` })],
                    });
                }
                else {
                    await interaction.reply({
                        embeds: [Embeds.IdMatchError.setFields({ name: "Failed:", value: "You are already registered with that username!" })],
                    });
                }
            }
            else {
                registeredPlayers.push({
                    discordID: interaction.user.id,
                    oculusId: optionResponse,
                    isCaptain: undefined,
                    isCoCap: undefined,
                    team: undefined,
                    isBotAdmin: undefined,
                });
                fs_1.default.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                await interaction.reply({
                    embeds: [Embeds.RegisterSuccess.setFields({ name: "Success", value: "Successfully registered as **" + optionResponse + "**" })],
                });
            }
        }
    }
}
exports.default = RegisterCommand;
//# sourceMappingURL=RegisterCommand.js.map