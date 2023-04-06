import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  AutocompleteInteraction
} from "discord.js";
import { TeamBot } from "../Bot";

export abstract class DiscordCommand {
  public actionRows: ActionRowBuilder[] = [];
  public properties: SlashCommandBuilder = new SlashCommandBuilder();
  /**
   * @param inDev - If true, command will be available instantly in testing guild only, if false, will be available to all guilds, but slowly. 
   */
  public abstract inDev: boolean 
  

  
  //code for the funtion goes here
  abstract executeInteraction(client: Client, interaction: CommandInteraction, teamBot: TeamBot): any

  async handleAutoComplete(i: AutocompleteInteraction, teamBot: TeamBot){
    return false;
  }
  
} 

