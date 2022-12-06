import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("interactionCreate", (interaction) =>{
            try {
                if(interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot)
                }
            } catch (e) {
                console.error(e)
            }
            
            if(interaction.isButton()){
                if(!interaction.customId.startsWith("schedreq")) return;
                if(interaction.customId.includes("Accept")){
                    interaction.deferUpdate();
                    const poo = import("../../events/ScheduleRequestAccept").then(poo=>{
                        poo.HandleScheduleRequestAccept(teamBot, interaction)
                    })
                } else if (interaction.customId.includes("Deny")){
                    interaction.deferUpdate()
                    
                }
            }
        })
    }
}