import { TeamBot } from "../../Bot";
import { DiscordListener } from "../DiscordListener";
import fs from "fs";
import { PCLTeam } from "../../interfaces/PCLTeam";

export class ReactionRemoveListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("messageReactionRemove", async (reaction, reactionUser) => {
        //did this to avoid type-checking errors becuase intellisense is stupid
        type dayOfWeek = "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "monday";

        type timeReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";

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
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name as timeReaction)) return; //not a tracked reaction
            const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
            const messageTeam = teamsDb.find((pclTeam) => { //find pclTeam
                return pclTeam.availability?.messageIds.includes(reaction.message.id);
            });

            if (!messageTeam) return; //not a scheduling message
            if (!messageTeam.players.includes(reactionUser.id)) return; //the player is not on the team
            //end of return stack

            const newAvailability = messageTeam.availability!;
            const fullMsg = await reaction.message.fetch()
            const dayIndex = fullMsg.content.toLowerCase() as dayOfWeek //type-checking is bad
            const r = reaction.emoji.name as timeReaction //type-checking is awful
            const rt = reactionToTime[r] as time //type-checking is terrible

            newAvailability[dayIndex][rt].splice(newAvailability[dayIndex][rt].indexOf(reactionUser.id), 1)
            //write new availability to the db
            teamsDb.find((pclTeam) => { 
                return pclTeam.name === messageTeam.name;
            })!.availability = newAvailability;
            fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        }); 
    } 
}
