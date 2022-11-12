import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("interactionCreate", (interaction) =>{
            try {
                if(interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction)
                }
            } catch (e) {
                console.error(e)
            }
        })
    }
}