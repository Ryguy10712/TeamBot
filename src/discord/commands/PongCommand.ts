import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";

export class PongCommand extends DiscordCommand {
  public inDev: boolean;

  constructor(){
    super()
    this.inDev = false
    this.properties
    .setName("pong")
    .setDescription("replies with ping")
  }

  executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>) {
    interaction.reply("Ping!")
  }
}