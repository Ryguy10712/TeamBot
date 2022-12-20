"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRow = exports.MatchTypeRow = exports.TeamListRow = exports.DenyButton = exports.AcceptButton = exports.MatchButton = exports.ChallengeButton = exports.ScrimButton = exports.TeamListMenu = void 0;
const discord_js_1 = require("discord.js");
const ScheduleRequestAccept_1 = require("../buttons/ScheduleRequestAccept");
const ScheduleRequestDeny_1 = require("../buttons/ScheduleRequestDeny");
class TeamListMenu extends discord_js_1.SelectMenuBuilder {
    constructor(params) {
        super();
        this.setCustomId("schedreqTeams");
        for (const option of params) {
            this.addOptions(option);
        }
    }
}
exports.TeamListMenu = TeamListMenu;
exports.ScrimButton = new discord_js_1.ButtonBuilder()
    .setCustomId("schedreqScrim")
    .setLabel("Scrim")
    .setStyle(discord_js_1.ButtonStyle.Primary);
exports.ChallengeButton = new discord_js_1.ButtonBuilder()
    .setCustomId("schedreqChallenge")
    .setLabel("Challenge")
    .setStyle(discord_js_1.ButtonStyle.Primary);
exports.MatchButton = new discord_js_1.ButtonBuilder()
    .setCustomId("schedreqMatch")
    .setLabel("Match")
    .setStyle(discord_js_1.ButtonStyle.Primary);
exports.AcceptButton = new discord_js_1.ButtonBuilder()
    .setCustomId("schedreqAccept")
    .setLabel("Accept")
    .setStyle(discord_js_1.ButtonStyle.Success);
exports.DenyButton = new discord_js_1.ButtonBuilder()
    .setCustomId("schedreqDeny")
    .setLabel("Decline")
    .setStyle(discord_js_1.ButtonStyle.Danger);
class TeamListRow extends discord_js_1.ActionRowBuilder {
    constructor(teamListMenu) {
        super();
        this.setComponents(teamListMenu);
    }
}
exports.TeamListRow = TeamListRow;
class MatchTypeRow extends discord_js_1.ActionRowBuilder {
    constructor() {
        super();
        this.setComponents(exports.MatchButton, exports.ChallengeButton, exports.ScrimButton);
    }
}
exports.MatchTypeRow = MatchTypeRow;
class RequestRow extends discord_js_1.ActionRowBuilder {
    constructor(enabled) {
        super();
        const acceptBtn = new ScheduleRequestAccept_1.ScheduleRequestAcceptButton();
        const denyBtn = new ScheduleRequestDeny_1.ScheduleRequestDenyButton();
        if (enabled === false) {
            acceptBtn.setDisabled(true);
            denyBtn.setDisabled(true);
        }
        this.addComponents(acceptBtn);
        this.addComponents(denyBtn);
    }
}
exports.RequestRow = RequestRow;
//# sourceMappingURL=ScheduleRequestComponents.js.map