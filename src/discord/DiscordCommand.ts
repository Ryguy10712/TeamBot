import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder
} from "discord.js";
import { TeamBot } from "../Bot";

export abstract class DiscordCommand {
  public actionRows: ActionRowBuilder[] = [];
  public properties: SlashCommandBuilder = new SlashCommandBuilder();
  public abstract inDev: boolean 
  /**
   * if indev, command will be available instantaneously in testing guild
   * if not indev, command registration will be delayed, but available globally
   */

  
  //code for the funtion goes here
  abstract executeInteraction(client: Client, interaction: CommandInteraction, teamBot: TeamBot): any
} 

