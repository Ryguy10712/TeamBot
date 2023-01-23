import { Client, CommandInteraction, CacheType, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import { DiscordContextMenu } from "../DiscordContextMenu";
import { embeds } from "../embeds/HelpCommandEmbeds";

export class HelpCommand extends DiscordCommand{
    public inDev: boolean;

    constructor(commands: Map<String, DiscordCommand | DiscordContextMenu>){
        super()
        this.inDev = false
        this.properties
        .setName("help")
        .setDescription("get more info on the more complicated commands because you dickheads cant figure it out yourselves")
        const option = new SlashCommandStringOption()
        .setRequired(true)
        .setName("command")
        .setDescription("the command you need to be taught like a 5 year old")
        for(const command of commands.values()){
            if(command instanceof DiscordCommand){
                option.addChoices({
                    name: command.properties.name,
                    value: command.properties.name
                })
            }
        }
        this.properties.addStringOption(option)
        
    }
    
    executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const response = interaction.options.get("command")!.value as string
        const helpembed = embeds.find(embed => {
            return embed.id == response
        })!

        if(!helpembed) {
            interaction.reply({content: "That command is literally so fucking easy to figure out that I'm not even going to bother to explaining it to you. Graduate elementary school, and THEN try to figure it out again", ephemeral: true})
            return
        }
        interaction.reply({embeds: [helpembed], ephemeral:true})
    }
}