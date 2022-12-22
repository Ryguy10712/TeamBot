"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateButtonRow = exports.UpdateButton = exports.MatchOrganizerEmbed = void 0;
const discord_js_1 = require("discord.js");
const ScheduleRequest_1 = require("../../interfaces/ScheduleRequest");
const OrganizerUpdate_1 = require("../buttons/OrganizerUpdate");
class MatchOrganizerEmbed extends discord_js_1.EmbedBuilder {
    constructor(team, opponent, type) {
        super();
        this.setColor("DarkButNotBlack");
        this.setTitle(`${ScheduleRequest_1.MatchType[type]} vs ${opponent.name}`);
        this.data.fields = [
            {
                name: "Tuesday",
                value: "...",
                inline: true
            },
            {
                name: "Wednesday",
                value: "...",
                inline: true
            },
            {
                name: "Thursday",
                value: "...",
                inline: true
            },
            {
                name: "Friday",
                value: "...",
                inline: true
            },
            {
                name: "Saturday",
                value: "...",
                inline: true
            },
            {
                name: "Sunday",
                value: "...",
                inline: true
            },
            {
                name: "Monday",
                value: "...",
                inline: true
            }
        ];
        const daysOfWeek = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
        for (const day of daysOfWeek) {
            Object.entries(team.availability[day]).forEach(entry => {
                if (entry[1].length >= 5 && opponent.availability[day][entry[0]].length >= 5) {
                    const field = this.data.fields.find(field => { return field.name.toLowerCase() === day; });
                    field.value = field.value.replace("...", "");
                    field.value += `${entry[0]} 🟢\n`;
                }
            });
        }
    }
}
exports.MatchOrganizerEmbed = MatchOrganizerEmbed;
class UpdateButton extends discord_js_1.ButtonBuilder {
    constructor(scheduleRequestId) {
        super();
        this.setStyle(discord_js_1.ButtonStyle.Primary);
        this.setLabel("Update");
        this.setCustomId(`matchOrganizerUpdate${scheduleRequestId}`);
    }
}
exports.UpdateButton = UpdateButton;
class UpdateButtonRow extends discord_js_1.ActionRowBuilder {
    constructor(scheduleRequestId, teamBot) {
        super();
        const btn = new OrganizerUpdate_1.MatchOrganizerUpdateButton(scheduleRequestId);
        this.addComponents(btn);
        teamBot.persistentButtons.set(btn.id, btn);
    }
}
exports.UpdateButtonRow = UpdateButtonRow;
//# sourceMappingURL=RequestAcceptComponents.js.map