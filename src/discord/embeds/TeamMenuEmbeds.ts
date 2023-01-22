import { EmbedBuilder } from "discord.js";

//INFO
export const ConfidentialityEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team confidentiality")
    .setDescription("Changes wether or not this team is visible to others. Useful for when your team is still a secret");

export const AddPlayerEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Add a player")
    .setDescription("Allows you to add a player by their Oculus username")
    .setFooter({text: "You have 2 minutes before this interaction is disposed"});

export const DisposedInteraction = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Moving on...")
    .addFields(
        {
            name: "Warning:",
            value: "This interaction is no longer available. Make a new one to start fresh."
        }
    )
    
export const RemovePlayerEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Remove a player")
    .setDescription("Allows you to remove a player by Oculus username");

export const EditNameEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Edit team name")
    .setDescription("Changes your team name. Everyone can see this unless your team is confidential");

export const RankEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team rank")
    .setDescription("Choose one of the buttons below to set your team's rank accordingly")

export const SetCoCapEmbed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Set team co-captain")
    .setDescription("Sets your cocaptain, or replaces the current one")

export class SetCoCapSuccess extends EmbedBuilder {
    constructor(oculusId: string){
        super()
        this.setColor("Green")
        this.setTitle("Alrighty!")
        this.setFields({
            name: "Success:",
            value: `**${oculusId}** is now your co-captain`
        })
    }
}

//ERROR
export const NotRegisteredError = new EmbedBuilder().setColor("Red").setTitle("Who even are you?").setFields({
    name: "Failed:",
    value: "You must register and create a team in order to use this command.",
});

export const PlayerNotFoundError = new EmbedBuilder().setColor("Red").setTitle("Check your spelling...").setFields({
    name: "Failed:",
    value: "That player does not exist. Check your spelling or make sure they are registered"
})

export const NoTeamError = new EmbedBuilder().setColor("Red").setTitle("Slow your roll...").setFields({
    name: "Failed:",
    value: "You must create a team first in order to use this command",
});

export const PlayerAlreadyOnError = new EmbedBuilder().setColor("Red").setTitle("Hold up...").setFields({
    name: "Failed:",
    value: "The provided player is already on a team."
})

export const PlayerNotOnError = new EmbedBuilder().setColor("Red").setTitle("That's awkward...").setFields({
    name: "Failed:",
    value: "That player is not on your team."
})

//SUCCESS

export const AddPlayerSuccess = new EmbedBuilder().setColor("Green").setTitle("Player added!").setFields({
    name: "Success",
    value: "The player has succesfully been added to your team"
})

export const RemovePlayerSuccess = new EmbedBuilder().setColor("Green").setTitle("Buh-bye!").setFields({
    name: "Success:",
    value: "The player has been removed from your team"
})

export const EditNameSuccess = new EmbedBuilder().setColor("Green").setTitle("Enjoy your new name!").setFields({
    name: "Success:",
    value: "Your team name has been updated"
})

export const ConfidentialitySuccess = new EmbedBuilder().setColor("Green").setTitle("Gotcha").setFields({
    name: "Success:",
    value: "Your team's confidentiality has been set"
})

export const RankSuccessEmbed = new EmbedBuilder().setColor("Green").setTitle("Alrighty!").setFields({
    name: "Success:",
    value: "Your team's ranking has been updated."
})
