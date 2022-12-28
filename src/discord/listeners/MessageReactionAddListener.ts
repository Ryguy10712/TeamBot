import { UserResolvable } from "discord.js";
import fs from "fs";
import { TeamBot } from "../../Bot";
import { HourReaction, PCLTeam } from "../../interfaces/PCLTeam";
import { DiscordListener } from "../DiscordListener";

export class MessageReactionAddListender extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        type dayOfWeek = "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "monday";

        type validReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";

        type time = "1PM" | "2PM" | "3PM" | "4PM" | "5PM" | "6PM" | "7PM" | "8PM" | "9PM" | "10PM" | "11PM" | "12PM";

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

        teamBot.client.on("messageReactionAdd", async (reaction, reactionUser) => {
            if(reactionUser.id === teamBot.client.user?.id) return;
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name as validReaction)) return; //not a tracked reaction
            const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
            if (
                !teamsDb.some((pclTeam) => {
                    return pclTeam.schedulingChannel === reaction.message.channelId;
                })
            ) {
                return; //this is not a reaction in a scheduling channel
            }
            const messageTeam = teamsDb.find((pclTeam) => {
                return pclTeam.availability!.messageIds.includes(reaction.message.id);
            });
            if (!messageTeam) return; //not a scheduling message
            if (!messageTeam.players.includes(reactionUser.id)) {
                reaction.users.remove(reactionUser as UserResolvable)
                return;
            }

            const fullMsg = await reaction.message.fetch(); //reaction.message is a partial structure, must fetch content
            const fullMsgContent = fullMsg.content.toLowerCase() as dayOfWeek;
            //fuck you, typescript type-checking 
            const r = reaction.emoji.name as validReaction;
            const rt = reactionToTime[r] as time;
            if (messageTeam.availability![fullMsgContent][rt].includes(reactionUser.id)) return; //prevents duplicate reaction logging
            messageTeam.availability![fullMsgContent][rt].push(reactionUser.id);

            teamsDb.find((pclTeam) => { //write newAvailability to database
                return pclTeam.name === messageTeam.name;
            })!.availability = messageTeam.availability;
            fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        });
    }
}
