"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSentEmbed = void 0;
const discord_js_1 = require("discord.js");
class RequestSentEmbed extends discord_js_1.EmbedBuilder {
    constructor(teamName) {
        super();
        this.setColor("Green");
        this.setTitle("Alrighty!");
        this.addFields({
            name: "Success",
            value: `Sent a scheduling request to ${teamName}`
        });
    }
}
exports.RequestSentEmbed = RequestSentEmbed;
//# sourceMappingURL=ScheduleRequestEmbeds.js.map