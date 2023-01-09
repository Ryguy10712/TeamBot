import { DiscordCommand } from "../DiscordCommand";
import { Client, CommandInteraction, CacheType } from "discord.js";

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

