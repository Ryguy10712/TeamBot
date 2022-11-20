import { Embed, EmbedBuilder } from "discord.js";

//INFO
export const ConfidentialityEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team confidentiality")
    .setDescription("Changes wether or not this team is visible to others. Useful for when your team is still a secret");

export const AddPlayerEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Add a player")
    .setDescription("Allows you to add a player by their Oculus username");

export const RemovePlayerEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Remove a player")
    .setDescription("Allows you to remove a player by Oculus username");

export const EditNameEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Edit team name")
    .setDescription("Changes your team name. Everyone can see this unless your team is confidential");

//ERROR
export const NotRegisteredError = new EmbedBuilder().setColor("Red").setTitle("Who even are you?").setFields({
    name: "Failed:",
    value: "You must register and create a team in order to use this command.",
});

export const NoTeamError = new EmbedBuilder().setColor("Red").setTitle("Slow your roll...").setFields({
    name: "Failed:",
    value: "You must create a team first in order to use this command",
});
