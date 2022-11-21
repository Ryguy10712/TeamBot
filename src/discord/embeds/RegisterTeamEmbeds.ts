import { TeamBot } from "../../Bot";
import { EmbedBuilder } from "discord.js";

//INFO EMBEDS
export const GuildConfirmationEmbed = new EmbedBuilder()
    .setTitle("Is this your team's main server?")
    .setDescription("My features will only work correctly is this is the server where you organize your matches.")
    .setFooter({ text: "You can always change this later with /team_config!" })
    .setColor("Yellow");

//Success EMBEDS
export let TeamCreateSuccess = new EmbedBuilder()
    .setTitle("Your team has been created!")
    .setDescription("Your team will be verified shortly")
    //fields will be set during runtime
    .setDescription("If any of this information is incorrect, change it immediateley with /team_config or you risk losing permission to run this command")
    .setColor("Green");

export const AlreadyCaptainError = new EmbedBuilder()
    .setTitle("Heads Up!")
    .setColor("Red")
    .setFields(
        {
            name: "Failed:",
            value: "You cannot be the captain or co-captain of multiple teams at once"
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
