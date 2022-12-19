import { ButtonBuilder } from "@discordjs/builders"
import { ButtonInteraction, Client } from "discord.js"
import { TeamBot } from "../Bot"

export abstract class DiscordButton extends ButtonBuilder {

    public readonly abstract id: string
    
    abstract execute(teamBot: TeamBot, client: Client, interaction: ButtonInteraction): any
}