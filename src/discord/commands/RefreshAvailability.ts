import { Client, CommandInteraction, CacheType, GuildTextBasedChannel, FetchReactionUsersOptions } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs"
import { DayOfWeek, PCLTeam } from "../../interfaces/PCLTeam";
import { UserNotOnTeamEmbed } from "../embeds/CommonEmbeds";

export class RefreshAvailabilityCommand extends DiscordCommand{
    public inDev: boolean;

    constructor(){
        super()
        this.inDev = true;
        this.properties.setName("fix_availability")
        this.properties.setDescription("only use this if availability appears incorrect")
    }
    
    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        interaction.deferReply({ephemeral: true})
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = teamsDb.find(pclTeam => {
            return pclTeam.players.includes(interaction.user.id)
        })

        if(!issuerTeam){
            interaction.reply({embeds: [new UserNotOnTeamEmbed], ephemeral: true});
            return;
        }
        if(!issuerTeam.schedulingChannel){
            interaction.reply({content: "Your team does not have a scheduling channel", ephemeral: true})
            return;
        }
        //end of return stack

        const reactionToTime = {
            "1️⃣": "1PM",
            "2️⃣": "2PM",
            "3️⃣": "3PM",
            "4️⃣": "4PM",
            "5️⃣": "5PM",
            "6️⃣": "6PM",
            "7️⃣": "7PM",
            "8️⃣": "8PM",
            "9️⃣": "9PM",
            "🔟": "10PM",
            "🕚": "11PM",
            "🕛": "12PM",
        };
        type validReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";
        type timeType = "1PM" | "2PM" | "3PM" | "4PM" | "5PM" | "6PM" | "7PM" | "8PM" | "9PM" | "10PM" | "11PM" | "12PM";
        const reactionArr = ["1️⃣" , "2️⃣" , "3️⃣" , "4️⃣" , "5️⃣" , "6️⃣" , "7️⃣" , "8️⃣" , "9️⃣" , "🔟" , "🕚" , "🕛"]
        try{
            const schedChan = await client.channels.fetch(issuerTeam.schedulingChannel) as GuildTextBasedChannel
            for(const messageId of issuerTeam.availability!.messageIds){
                const msg = await schedChan.messages.fetch(messageId)
                const day = msg.content.toLowerCase() as DayOfWeek
                const reactionCollection = msg.reactions.valueOf();
                for (const reaction of reactionCollection){
                    const emoji = reaction[1].emoji.name as validReaction
                    if(!reactionArr.includes(emoji)) break;
                    const time = reactionToTime[emoji as validReaction]
                    const users = await reaction[1].users.fetch()
                    for(const user of users){
                        if(user[1].id === teamBot.client.user?.id) break; //teambot reaction
                        const currentField = issuerTeam.availability![day][time as timeType]
                        if(!currentField.includes(user[1].id)){
                            issuerTeam.availability![day][time as timeType].push(user[1].id);
                        }
                    }
                }
            }
            fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb))
            interaction.followUp({content: "success"})
        } catch(e: any) {
            teamBot.log(e, false)
            interaction.reply({content: "I cannot access your scheduling channel. Was it deleted? Do I have the right permissions?"})
        }
       
        
    }
}