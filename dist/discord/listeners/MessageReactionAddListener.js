"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReactionAddListender = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const DiscordListener_1 = require("../DiscordListener");
class MessageReactionAddListender extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        const validReactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        teamBot.client.on("messageReactionAdd", async (reaction, reactionUser) => {
            if (!validReactions.includes(reaction.emoji.name))
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
            if (!messageTeam.players.includes(reactionUser.id))
                return;
            const newAvailability = messageTeam.availability;
            const fullMsg = await reaction.message.channel.messages.fetch(reaction.message.id);
            switch (fullMsg.content.toLowerCase()) {
                case "monday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.monday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.monday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.monday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.monday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.monday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.monday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.monday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.monday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.monday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.monday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.monday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.monday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "tuesday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.tuesday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.tuesday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.tuesday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.tuesday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.tuesday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.tuesday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.tuesday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.tuesday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.tuesday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.tuesday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.tuesday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.tuesday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "wednesday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.wednesday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.wednesday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.wednesday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.wednesday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.wednesday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.wednesday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.wednesday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.wednesday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.wednesday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.wednesday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.wednesday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.wednesday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "thursday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.thursday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.thursday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.thursday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.thursday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.thursday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.thursday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.thursday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.thursday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.thursday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.thursday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.thursday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.thursday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "friday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.friday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.friday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.friday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.friday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.friday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.friday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.friday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.friday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.friday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.friday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.friday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.friday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "saturday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.saturday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.saturday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.saturday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.saturday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.saturday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.saturday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.saturday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.saturday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.saturday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.saturday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.saturday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.saturday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
                case "sunday":
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.sunday["1️⃣"].push(reactionUser.id);
                            break;
                        case "2️⃣":
                            newAvailability.sunday["2️⃣"].push(reactionUser.id);
                            break;
                        case "3️⃣":
                            newAvailability.sunday["3️⃣"].push(reactionUser.id);
                            break;
                        case "4️⃣":
                            newAvailability.sunday["4️⃣"].push(reactionUser.id);
                            break;
                        case "5️⃣":
                            newAvailability.sunday["5️⃣"].push(reactionUser.id);
                            break;
                        case "6️⃣":
                            newAvailability.sunday["6️⃣"].push(reactionUser.id);
                            break;
                        case "7️⃣":
                            newAvailability.sunday["7️⃣"].push(reactionUser.id);
                            break;
                        case "8️⃣":
                            newAvailability.sunday["8️⃣"].push(reactionUser.id);
                            break;
                        case "9️⃣":
                            newAvailability.sunday["9️⃣"].push(reactionUser.id);
                            break;
                        case "🔟":
                            newAvailability.sunday["🔟"].push(reactionUser.id);
                            break;
                        case "🕚":
                            newAvailability.sunday["🕚"].push(reactionUser.id);
                            break;
                        case "🕛":
                            newAvailability.sunday["🕛"].push(reactionUser.id);
                            break;
                    }
                    break;
            }
            teamsDb.find((pclTeam) => {
                return pclTeam.name === messageTeam.name;
            }).availability = newAvailability;
            fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        });
    }
}
exports.MessageReactionAddListender = MessageReactionAddListender;
//# sourceMappingURL=MessageReactionAddListener.js.map