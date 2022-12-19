import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot);
                }
            } catch (e) {
                console.error(e);
            }

            if (interaction.isButton()) {
                if(!teamBot.persistentButtons.has(interaction.customId)){
                    interaction.deferReply()
                    setTimeout(() => {
                        if(!interaction.replied){
                            interaction.followUp({content: "I do not understand. Try refreshing the buttons eh?", ephemeral: true})
                            return;
                        }
                    }, 10_000)
                }
                teamBot.persistentButtons.get(interaction.customId)?.execute(teamBot, teamBot.client, interaction)
                
            }
        });
    }
}
