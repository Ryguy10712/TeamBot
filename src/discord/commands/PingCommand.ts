import { DiscordCommand } from "../DiscordCommand";
import { TeamBot } from "../../Bot";
import { Client, CommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";

export class PingCommand extends DiscordCommand {
    public inDev: boolean;
    
    constructor(){
        super()
        this.inDev = false
        this.properties
        .setName("ping")
        .setDescription("replies with Pong!")
        
    }
    
   executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>) {
       interaction.reply("Pong!")
   }
}