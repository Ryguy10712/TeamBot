import { Client, CommandInteraction, CacheType, SlashCommandStringOption, ThreadMemberFlagsBitField, GuildTextBasedChannel } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordCommand } from "../../DiscordCommand";
import fs from "fs"
import { PCLTeam } from "../../../interfaces/PCLTeam";

class TeamOption extends SlashCommandStringOption {
    constructor(teamsDb: PCLTeam[]) {
        super()
        this.setName("team")
        for(const team of teamsDb){
            if(team.availability){
                this.addChoices({
                    name: team.name,
                    value: team.name
                })
            }
        }
    }
}

export class ResetAvailability extends DiscordCommand {
    public inDev: boolean;
    private teamDb: PCLTeam[]

    constructor() {
        super()
        this.teamDb = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
        this.inDev = true;
        this.properties
        .setName("reset_availability")
        .addStringOption(
            new TeamOption(this.teamDb)
        )
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        if(interaction.user.id != "758816397399949343") return interaction.reply({content: "You cannot run this command", ephemeral: true})

        const teamReply = interaction.options.get("team")

        if(teamReply){
            const teamValue = teamReply.value as string;
            const team = this.teamDb.find(pclTeam => {
                return pclTeam.name === teamValue
            })!
            try {
                const schedulingChannel = await client.channels.fetch(team.schedulingChannel!) as GuildTextBasedChannel

                for(const messageId of team.availability!.messageIds){
                    const msg = await schedulingChannel!.messages.fetch(messageId)
                    
                    for (const reaction of msg.reactions.valueOf()){
                        
                        for(const reactionAuthor of reaction[1].users.valueOf()){
                            if(reactionAuthor[1].id != client.user!.id){
                                reaction[1].users.remove(reactionAuthor[1])
                            }
                        }
                    }
                }
                interaction.reply(".")

            } catch {
                interaction.reply({ephemeral: true, content: "Invalid channelId"})
            }
        }

        

    }
    
}