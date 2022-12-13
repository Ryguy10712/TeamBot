"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRemoveListener = void 0;
const tslib_1 = require("tslib");
const DiscordListener_1 = require("../DiscordListener");
const fs_1 = tslib_1.__importDefault(require("fs"));
class ReactionRemoveListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("messageReactionRemove", async (reaction, reactionUser) => {
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
            if (!Object.keys(reactionToTime).includes(reaction.emoji.name))
                return;
            const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
            const messageTeam = teamsDb.find((pclTeam) => {
                return pclTeam.availability?.messageIds.includes(reaction.message.id);
            });
            if (!messageTeam)
                return;
            if (!messageTeam.players.includes(reactionUser.id))
                return;
            const newAvailability = messageTeam.availability;
            const fullMsg = await reaction.message.fetch();
            const dayIndex = fullMsg.content.toLowerCase();
            const r = reaction.emoji.name;
            const rt = reactionToTime[r];
            newAvailability[dayIndex][rt].splice(newAvailability[dayIndex][rt].indexOf(reactionUser.id), 1);
            teamsDb.find((pclTeam) => {
                return pclTeam.name === messageTeam.name;
            }).availability = newAvailability;
            fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        });
    }
}
exports.ReactionRemoveListener = ReactionRemoveListener;
//# sourceMappingURL=ReactionRemoveListener.js.map