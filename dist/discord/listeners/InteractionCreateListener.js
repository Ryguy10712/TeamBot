"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
            if (interaction.isButton()) {
                if (!interaction.customId.startsWith("schedreq"))
                    return;
                if (interaction.customId.includes("Accept")) {
                    interaction.deferUpdate();
                    const poo = Promise.resolve().then(() => __importStar(require("../../events/ScheduleRequestAccept"))).then(poo => {
                        poo.HandleScheduleRequestAccept(teamBot, interaction);
                    });
                }
                else if (interaction.customId.includes("Deny")) {
                    interaction.deferUpdate();
                }
            }
        });
    }
}
exports.InteractionCreateListener = InteractionCreateListener;
//# sourceMappingURL=InteractionCreateListener.js.map