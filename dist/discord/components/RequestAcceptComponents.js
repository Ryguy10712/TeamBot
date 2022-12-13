"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchOrganizerEmbed = void 0;
const discord_js_1 = require("discord.js");
const ScheduleRequest_1 = require("../../interfaces/ScheduleRequest");
class MatchOrganizerEmbed extends discord_js_1.EmbedBuilder {
    constructor(opposingTeam, type) {
        super();
        this.setColor("DarkButNotBlack");
        this.setTitle(`${ScheduleRequest_1.MatchType[type]} vs ${opposingTeam}`);
        this.addFields({
            name: "Tuesday",
            value: "...",
            inline: true
        }, {
            name: "Wednesday",
            value: "...",
            inline: true
        }, {
            name: "Thursday",
            value: "...",
            inline: true
        }, {
            name: "Friday",
            value: "...",
            inline: true
        }, {
            name: "Saturday",
            value: "...",
            inline: true
        }, {
            name: "Sunday",
            value: "...",
            inline: true
        }, {
            name: "Monday",
            value: "...",
            inline: true
        });
    }
}
exports.MatchOrganizerEmbed = MatchOrganizerEmbed;
//# sourceMappingURL=RequestAcceptComponents.js.map