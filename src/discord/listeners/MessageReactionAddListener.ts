import { TeamBot } from "../../Bot";
import { availability } from "../../interfaces/PCLTeam";
import { DiscordListener } from "../DiscordListener";

export class MessageReactionAddListender extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        type dayOfWeek = "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "monday";

        type validReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";

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

        teamBot.client.on("messageReactionAdd", async (reaction, reactionUser) => {
            if(reactionUser.id === teamBot.client.user?.id) return;
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name as validReaction)) return; //not a tracked reaction
            //find the reactor's team
            const reactor = await teamBot.prisma.teamPlayer.findFirst({
                where: {playerId: reactionUser.id}
            })
            const messageTeam = await teamBot.prisma.teamAvailability.findFirst({
                where: {
                    OR: [
                    {tuesday: reaction.message.id}, {wednesday: reaction.message.id}, 
                    {thursday: reaction.message.id}, {friday: reaction.message.id},
                    {saturday: reaction.message.id}, {sunday: reaction.message.id},
                    {monday: reaction.message.id}
                    ]
                }
            })
            if(!messageTeam){
                return;
            }
            //check to see if bot is in maintenance mode
            if(teamBot.maintenanceMode){
                reaction.users.remove(reactionUser.id)
                reactionUser.send("Your reaction was removed because TeamBot is undergoing maintenance")
                return;
            }
            if(reactor?.teamId != messageTeam.teamId){
                reaction.users.remove(reactionUser.id)
                return;
            }

            
            const fullMsg = await reaction.message.fetch(); //reaction.message is a partial structure, must fetch content
            const fullMsgContent = fullMsg.content.toLowerCase() as dayOfWeek;
            //fuck you, typescript type-checking 
            const r = reaction.emoji.name as validReaction;
            const rt = reactionToTime[r] as time;
            teamBot.log(`${reactionUser.username} (${messageTeam?.teamId}) reacted to ${fullMsgContent} on ${rt}`, false)
            let obj = reactor[fullMsgContent]?.valueOf()
            if(!obj){
                obj = {}
            };
            (obj as availability)[rt] = true;
            const arg = {where: {playerId: reactionUser.id}, data: {[fullMsgContent]: obj}}
            teamBot.currentQueue?.enqueue(true, fullMsgContent, rt, reactionUser.id)

        });
    }
}
