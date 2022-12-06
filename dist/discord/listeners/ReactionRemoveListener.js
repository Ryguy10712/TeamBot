"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRemoveListener = void 0;
const tslib_1 = require("tslib");
const DiscordListener_1 = require("../DiscordListener");
const fs_1 = tslib_1.__importDefault(require("fs"));
class ReactionRemoveListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("messageReactionRemove", (reaction, reactionUser) => {
            const validReactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
            if (!validReactions.includes(reaction.emoji.name))
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
            switch (messageTeam.availability.messageIds.indexOf(reaction.message.id)) {
                case 0:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.tuesday["1️⃣"].splice(newAvailability.tuesday["1️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "2️⃣":
                            newAvailability.tuesday["2️⃣"].splice(newAvailability.tuesday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.tuesday["3️⃣"].splice(newAvailability.tuesday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.tuesday["4️⃣"].splice(newAvailability.tuesday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.tuesday["5️⃣"].splice(newAvailability.tuesday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.tuesday["6️⃣"].splice(newAvailability.tuesday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.tuesday["7️⃣"].splice(newAvailability.tuesday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.tuesday["8️⃣"].splice(newAvailability.tuesday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.tuesday["9️⃣"].splice(newAvailability.tuesday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.tuesday["🔟"].splice(newAvailability.tuesday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.tuesday["🕚"].splice(newAvailability.tuesday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.tuesday["🕛"].splice(newAvailability.tuesday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 1:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.wednesday["1️⃣"].splice(newAvailability.wednesday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.wednesday["2️⃣"].splice(newAvailability.wednesday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.wednesday["3️⃣"].splice(newAvailability.wednesday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.wednesday["4️⃣"].splice(newAvailability.wednesday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.wednesday["5️⃣"].splice(newAvailability.wednesday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.wednesday["6️⃣"].splice(newAvailability.wednesday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.wednesday["7️⃣"].splice(newAvailability.wednesday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.wednesday["8️⃣"].splice(newAvailability.wednesday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.wednesday["9️⃣"].splice(newAvailability.wednesday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.wednesday["🔟"].splice(newAvailability.wednesday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.wednesday["🕚"].splice(newAvailability.wednesday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.wednesday["🕛"].splice(newAvailability.wednesday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 2:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.thursday["1️⃣"].splice(newAvailability.thursday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.thursday["2️⃣"].splice(newAvailability.thursday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.thursday["3️⃣"].splice(newAvailability.thursday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.thursday["4️⃣"].splice(newAvailability.thursday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.thursday["5️⃣"].splice(newAvailability.thursday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.thursday["6️⃣"].splice(newAvailability.thursday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.thursday["7️⃣"].splice(newAvailability.thursday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.thursday["8️⃣"].splice(newAvailability.thursday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.thursday["9️⃣"].splice(newAvailability.thursday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.thursday["🔟"].splice(newAvailability.thursday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.thursday["🕚"].splice(newAvailability.thursday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.thursday["🕛"].splice(newAvailability.thursday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 3:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.friday["1️⃣"].splice(newAvailability.friday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.friday["2️⃣"].splice(newAvailability.friday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.friday["3️⃣"].splice(newAvailability.friday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.friday["4️⃣"].splice(newAvailability.friday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.friday["5️⃣"].splice(newAvailability.friday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.friday["6️⃣"].splice(newAvailability.friday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.friday["7️⃣"].splice(newAvailability.friday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.friday["8️⃣"].splice(newAvailability.friday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.friday["9️⃣"].splice(newAvailability.friday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.friday["🔟"].splice(newAvailability.friday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.friday["🕚"].splice(newAvailability.friday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.friday["🕛"].splice(newAvailability.friday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 4:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.saturday["1️⃣"].splice(newAvailability.saturday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.saturday["2️⃣"].splice(newAvailability.saturday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.saturday["3️⃣"].splice(newAvailability.saturday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.saturday["4️⃣"].splice(newAvailability.saturday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.saturday["5️⃣"].splice(newAvailability.saturday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.saturday["6️⃣"].splice(newAvailability.saturday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.saturday["7️⃣"].splice(newAvailability.saturday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.saturday["8️⃣"].splice(newAvailability.saturday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.saturday["9️⃣"].splice(newAvailability.saturday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.saturday["🔟"].splice(newAvailability.saturday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.saturday["🕚"].splice(newAvailability.saturday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.saturday["🕛"].splice(newAvailability.saturday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 5:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.sunday["1️⃣"].splice(newAvailability.sunday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.sunday["2️⃣"].splice(newAvailability.sunday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.sunday["3️⃣"].splice(newAvailability.sunday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.sunday["4️⃣"].splice(newAvailability.sunday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.sunday["5️⃣"].splice(newAvailability.sunday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.sunday["6️⃣"].splice(newAvailability.sunday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.sunday["7️⃣"].splice(newAvailability.sunday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.sunday["8️⃣"].splice(newAvailability.sunday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.sunday["9️⃣"].splice(newAvailability.sunday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.sunday["🔟"].splice(newAvailability.sunday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.sunday["🕚"].splice(newAvailability.sunday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.sunday["🕛"].splice(newAvailability.sunday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
                    break;
                case 6:
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            newAvailability.monday["1️⃣"].splice(newAvailability.monday["1️⃣"].indexOf(reactionUser.id), 1);
                            console.log(newAvailability);
                            break;
                        case "2️⃣":
                            newAvailability.monday["2️⃣"].splice(newAvailability.monday["2️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "3️⃣":
                            newAvailability.monday["3️⃣"].splice(newAvailability.monday["3️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "4️⃣":
                            newAvailability.monday["4️⃣"].splice(newAvailability.monday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "5️⃣":
                            newAvailability.monday["5️⃣"].splice(newAvailability.monday["4️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "6️⃣":
                            newAvailability.monday["6️⃣"].splice(newAvailability.monday["6️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "7️⃣":
                            newAvailability.monday["7️⃣"].splice(newAvailability.monday["7️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "8️⃣":
                            newAvailability.monday["8️⃣"].splice(newAvailability.monday["8️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "9️⃣":
                            newAvailability.monday["9️⃣"].splice(newAvailability.monday["9️⃣"].indexOf(reactionUser.id), 1);
                            break;
                        case "🔟":
                            newAvailability.monday["🔟"].splice(newAvailability.monday["🔟"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕚":
                            newAvailability.monday["🕚"].splice(newAvailability.monday["🕚"].indexOf(reactionUser.id), 1);
                            break;
                        case "🕛":
                            newAvailability.monday["🕛"].splice(newAvailability.monday["🕛"].indexOf(reactionUser.id), 1);
                            break;
                    }
            }
            teamsDb.find((pclTeam) => {
                return pclTeam.name === messageTeam.name;
            }).availability = newAvailability;
            fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        });
    }
}
exports.ReactionRemoveListener = ReactionRemoveListener;
//# sourceMappingURL=ReactionRemoveListener.js.map