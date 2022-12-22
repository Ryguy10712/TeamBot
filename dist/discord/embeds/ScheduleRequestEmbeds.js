"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedReqPrimaryEmbed = exports.RequestSentEmbed = void 0;
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
class SchedReqPrimaryEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("DarkButNotBlack");
        this.setTitle("Pick a team and match type");
        this.setDescription("If a team isn't listed, they have not set their scheduling channel yet. Maybe let them know eh?");
    }
}
exports.SchedReqPrimaryEmbed = SchedReqPrimaryEmbed;
//# sourceMappingURL=ScheduleRequestEmbeds.js.map