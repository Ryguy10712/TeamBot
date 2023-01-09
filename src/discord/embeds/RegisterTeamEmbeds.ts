import { TeamBot } from "../../Bot";
import { Embed, EmbedBuilder } from "discord.js";

//INFO EMBEDS
export const GuildConfirmationEmbed = new EmbedBuilder()
    .setTitle("Is this your team's main server?")
    .setDescription("My features will only work correctly is this is the server where you organize your matches.")
    .setFooter({ text: "You can always change this later with /team_config!" })
    .setColor("Yellow");

//Success EMBEDS
export class TeamCreateSuccess extends EmbedBuilder {
    constructor(teamName: string, coCapId: string | undefined, rank: string | undefined){
        super()
        this.setColor("Green")
        this.setTitle("Your team has been created!")
        this.setDescription("If any of this information is incorrect, change it immediateley with **/team_menu**")
        this.setFields({
            name: "Success:",
            value: `Team **${teamName}** has been creatd with the following:\n**Co-Captain:** ${coCapId}\n **Rank:** ${rank}`
        })
    }
}

export const AlreadyCaptainError = new EmbedBuilder()
    .setTitle("Heads Up!")
    .setColor("Red")
    .setFields(
        {
            name: "Failed:",
            value: "You must not be on a team when registering a new team."
        }
    )

export const CoCapOccuipiedError = new EmbedBuilder()
    .setTitle("Heads Up!")
    .setColor("Red")
    .setFields(
        {
            name: "Failed:",
            value: "Your co-captain is already a captain or co-captain of another team"
        }
    )
    

//ERROR EMBEDS
export const NotRegisteredError = new EmbedBuilder()
    .setTitle("You are not registered!")
    .setDescription("You cannot run this command until you are registered.")
    .setFooter({ text: "Proceed with this command once you are registered" })
    .setColor("Red");

export const NotTeamGuildError = new EmbedBuilder()
    .setTitle("Let's run this elsewhere...")
    .setDescription("This command must be ran in your team's guild so I can work properly")
    .setColor("Red");

export const CoCapNotRegisteredError = new EmbedBuilder()
    .setTitle("Slow down...")
    .addFields({
        name: "Error:",
        value: "Your Co-Captain is not registered.",
    })
    .setFooter({ text: "Proceed once they are registered, or add them later." })
    .setColor("Red");

export const TeamNameMatchError = new EmbedBuilder()
    .setTitle("Try to be a little bit more original...")
    .addFields(
        {
            name: "Failed:",
            value: "A team with that name already exists. If you believe someone is trying to impersonate your team, contact Ryguy to have it resolved"
        }
    )
    .setColor("Red")

export const CaptainCoCapMatchError = new EmbedBuilder()
        .setTitle("That makes no sense")
        .addFields({
            name: "Failed",
            value: "You cannot be the captain, and the cocaptain of the same team"
        })
        .setColor("Red")
