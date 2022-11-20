"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTeamError = exports.NotRegisteredError = exports.EditNameEmbed = exports.RemovePlayerEmbed = exports.AddPlayerEmbed = exports.ConfidentialityEmbed = void 0;
const discord_js_1 = require("discord.js");
exports.ConfidentialityEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team confidentiality")
    .setDescription("Changes wether or not this team is visible to others. Useful for when your team is still a secret");
exports.AddPlayerEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Add a player")
    .setDescription("Allows you to add a player by their Oculus username");
exports.RemovePlayerEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Remove a player")
    .setDescription("Allows you to remove a player by Oculus username");
exports.EditNameEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Edit team name")
    .setDescription("Changes your team name. Everyone can see this unless your team is confidential");
exports.NotRegisteredError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Who even are you?").setFields({
    name: "Failed:",
    value: "You must register and create a team in order to use this command.",
});
exports.NoTeamError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Slow your roll...").setFields({
    name: "Failed:",
    value: "You must create a team first in order to use this command",
});
//# sourceMappingURL=TeamConfigEmbeds.js.map