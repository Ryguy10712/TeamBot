import { Client, CommandInteraction, CacheType, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordCommand } from "../../DiscordCommand"
import { DiscordContextMenu } from "../../DiscordContextMenu";

export class AddToTeamCommand extends DiscordContextMenu{
    public inDev: boolean;

    constructor(){
        super()
        this.inDev = true;
        this.properties = new ContextMenuCommandBuilder()
            .setName("Add to team")
            .setType(ApplicationCommandType.User)
            

    }
    executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        interaction.reply("Not yet implemented")
    }

}