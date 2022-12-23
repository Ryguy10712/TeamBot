import { Client, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import { TeamBot } from "../Bot";

export abstract class DiscordContextMenu {
    public abstract inDev: boolean;
    public properties: ContextMenuCommandBuilder;

    constructor(){
        this.properties = new ContextMenuCommandBuilder()
    }

abstract executeInteraction(client: Client, interaction: ContextMenuCommandInteraction, teamBot: TeamBot): any
}