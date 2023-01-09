import { TeamBot } from "../../Bot";
import { DiscordListener } from "../DiscordListener";
import fs from "fs";
import { availability, PCLTeam } from "../../interfaces/PCLTeam";

export class ReactionRemoveListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("messageReactionRemove", async (reaction, reactionUser) => {
            //did this to avoid type-checking errors becuase intellisense is stupid
            type dayOfWeek = "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "monday";

            type timeReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";

            type time = "one" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "eleven" | "twelve";

            const reactionToTime = {
                "1️⃣": "one",
                "2️⃣": "two",
                "3️⃣": "three",
                "4️⃣": "four",
                "5️⃣": "five",
                "6️⃣": "six",
                "7️⃣": "seven",
                "8️⃣": "eight",
                "9️⃣": "nine",
                "🔟": "ten",
                "🕚": "eleven",
                "🕛": "twelve",
            };
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name as timeReaction)) return; //not a tracked reaction
            const reactor = await teamBot.prisma.teamPlayer.findFirst({
                where: { playerId: reactionUser.id },
            });
            const messageTeam = await teamBot.prisma.teamAvailability.findFirst({
                where: {
                    OR: [
                        { tuesday: reaction.message.id },
                        { wednesday: reaction.message.id },
                        { thursday: reaction.message.id },
                        { friday: reaction.message.id },
                        { saturday: reaction.message.id },
                        { sunday: reaction.message.id },
                        { monday: reaction.message.id },
                    ],
                },
            });

            if (!messageTeam) return; //not a scheduling message
            if (reactor?.teamId != messageTeam.teamId) return; //the player is not on the team
            //end of return stack

            const fullMsg = await reaction.message.fetch();
            const dayIndex = fullMsg.content.toLowerCase() as dayOfWeek; //type-checking is bad
            const r = reaction.emoji.name as timeReaction; //type-checking is awful
            const rt = reactionToTime[r] as time; //type-checking is terrible
            let obj = reactor[dayIndex]?.valueOf();
            if(!obj){
                obj = {}
            }
            (obj as availability)[rt] = false;
            teamBot.log(`${reactionUser.username} (${messageTeam.teamId}) unreacted to ${dayIndex} on ${rt}`, false);

            //write new availability to the db
            teamBot.prisma.teamPlayer.update({
                where: {playerId: reactionUser.id},
                data: {[dayIndex]: obj}
            }).then(() => {teamBot.prisma.$disconnect()})
        });
    }
}
