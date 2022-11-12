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

  abstract executeInteraction(client: Client, interaction: CommandInteraction): any
}
