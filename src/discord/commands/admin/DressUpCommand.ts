import { Client, CommandInteraction, CacheType, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordCommand } from "../../DiscordCommand";

export class DressUpCommand extends DiscordCommand {

    public inDev: boolean;
    constructor() {
        super()
        this.inDev = true,
        this.properties
        .setName("dressup")
        .setDescription("ADMINS ONLY!!!!")
        const property = new SlashCommandStringOption()
        .setName("property")
        .setDescription("the property you want to cange")
        .setRequired(true)
        .setChoices(
            {
                name: "Status",
                value: "status"
            },
            {
                name: "Username",
                value: "username"
            },
        )
        const value = new SlashCommandStringOption()
        .setName("value")
        .setRequired(false)
        .setDescription("what it will be changed to")
        this.properties.addStringOption(property)
        .addStringOption(value)
    }
    executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        if(interaction.user.id != "758816397399949343") {
            interaction.reply({content: "This isn't for you", ephemeral: true})
            return;
        }
        const property = interaction.options.get("property")?.value as string
        const response = interaction.options.get("value")?.value as string
        switch(property){
            case "status":
                if(!response){
                    client.user?.setActivity()
                    break;
                } else {
                    client.user?.setActivity({name: response})
                    break;
                }
               
            case "username":
                client.user?.setUsername(response)
                break;
        }
        interaction.reply({content: "Success", ephemeral: true})
    }
}