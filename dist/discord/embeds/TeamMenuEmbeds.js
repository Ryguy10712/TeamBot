"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankSuccessEmbed = exports.ConfidentialitySuccess = exports.EditNameSuccess = exports.RemovePlayerSuccess = exports.AddPlayerSuccess = exports.PlayerNotOnError = exports.PlayerAlreadyOnError = exports.NoTeamError = exports.PlayerNotFoundError = exports.NotRegisteredError = exports.RankEmbed = exports.EditNameEmbed = exports.RemovePlayerEmbed = exports.DisposedInteraction = exports.AddPlayerEmbed = exports.ConfidentialityEmbed = void 0;
const discord_js_1 = require("discord.js");
exports.ConfidentialityEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team confidentiality")
    .setDescription("Changes wether or not this team is visible to others. Useful for when your team is still a secret");
exports.AddPlayerEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Add a player")
    .setDescription("Allows you to add a player by their Oculus username")
    .setFooter({ text: "You have 2 minutes before this interaction is disposed" });
exports.DisposedInteraction = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Moving on...")
    .addFields({
    name: "Warning:",
    value: "This interaction is no longer available. Make a new one to start fresh."
});
exports.RemovePlayerEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Remove a player")
    .setDescription("Allows you to remove a player by Oculus username");
exports.EditNameEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Edit team name")
    .setDescription("Changes your team name. Everyone can see this unless your team is confidential");
exports.RankEmbed = new discord_js_1.EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team rank")
    .setDescription("Choose one of the buttons below to set your team's rank accordingly");
exports.NotRegisteredError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Who even are you?").setFields({
    name: "Failed:",
    value: "You must register and create a team in order to use this command.",
});
exports.PlayerNotFoundError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Check your spelling...").setFields({
    name: "Failed:",
    value: "That player does not exist. Check your spelling or make sure they are registered"
});
exports.NoTeamError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Slow your roll...").setFields({
    name: "Failed:",
    value: "You must create a team first in order to use this command",
});
exports.PlayerAlreadyOnError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("Hold up...").setFields({
    name: "Failed:",
    value: "The provided player is already on a team."
});
exports.PlayerNotOnError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("That's awkward...").setFields({
    name: "Failed:",
    value: "That player is not on your team."
});
exports.AddPlayerSuccess = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Player added!").setFields({
    name: "Success",
    value: "The player has succesfully been added to your team"
});
exports.RemovePlayerSuccess = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Buh-bye!").setFields({
    name: "Success:",
    value: "The player has been removed from your team"
});
exports.EditNameSuccess = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Enjoy your new name!").setFields({
    name: "Success:",
    value: "Your team name has been updated"
});
exports.ConfidentialitySuccess = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Gotcha").setFields({
    name: "Success:",
    value: "Your team's confidentiality has been set"
});
exports.RankSuccessEmbed = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Alrighty!").setFields({
    name: "Success:",
    value: "Your team's ranking has been updated."
});
//# sourceMappingURL=TeamMenuEmbeds.js.map