import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordCommand } from "../../DiscordCommand";

export class ReactCommand extends DiscordCommand {
    public inDev: boolean = true;

    constructor(){
        super()
        this.properties
        
    }

    executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        
    }

}