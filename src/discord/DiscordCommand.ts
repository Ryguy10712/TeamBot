import {
  Client,
  CommandInteraction,
  SlashCommandBuilder
} from "discord.js";

export abstract class DiscordCommand {
  public properties: SlashCommandBuilder
  public abstract inDev: boolean

  constructor(){
    this.properties = new SlashCommandBuilder()
  }
  //code for the funtion goes here
  abstract executeInteraction(client: Client, interaction: CommandInteraction): any
}
