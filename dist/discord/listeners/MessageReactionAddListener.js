"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReactionAddListender = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const DiscordListener_1 = require("../DiscordListener");
class MessageReactionAddListender extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
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
            if (reactionUser.id === teamBot.client.user?.id)
                return;
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name))
                return;
            const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
            if (!teamsDb.some((pclTeam) => {
                return pclTeam.schedulingChannel === reaction.message.channelId;
            })) {
                return;
            }
            const messageTeam = teamsDb.find((pclTeam) => {
                return pclTeam.availability.messageIds.includes(reaction.message.id);
            });
            if (!messageTeam)
                return;
            if (!messageTeam.players.includes(reactionUser.id)) {
                reaction.remove();
                return;
            }
            const fullMsg = await reaction.message.fetch();
            const fullMsgContent = fullMsg.content.toLowerCase();
            const r = reaction.emoji.name;
            const rt = reactionToTime[r];
            if (messageTeam.availability[fullMsgContent][rt].includes(reactionUser.id))
                return;
            messageTeam.availability[fullMsgContent][rt].push(reactionUser.id);
            teamsDb.find((pclTeam) => {
                return pclTeam.name === messageTeam.name;
            }).availability = messageTeam.availability;
            fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        });
    }
}
exports.MessageReactionAddListender = MessageReactionAddListender;
//# sourceMappingURL=MessageReactionAddListener.js.map