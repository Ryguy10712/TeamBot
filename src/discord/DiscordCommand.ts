import {
  Client,
  CommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import { TeamBot } from "../Bot";

export abstract class DiscordCommand {
  public properties: SlashCommandBuilder
  public abstract inDev: boolean 
  /**
   * if indev, command will be available instantaneously in testing guild
   * if not indev, command registration will be delayed, but available globally
   */

  constructor(){
    this.properties = new SlashCommandBuilder()
  }
  //code for the funtion goes here
  abstract executeInteraction(client: Client, interaction: CommandInteraction, teamBot: TeamBot): any
} 

