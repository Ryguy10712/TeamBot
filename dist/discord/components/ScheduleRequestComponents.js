"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRow = exports.MatchTypeRow = exports.TeamListRow = exports.DenyButton = exports.AcceptButton = exports.MatchButton = exports.ChallengeButton = exports.ScrimButton = exports.TeamListMenu = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const fs_1 = tslib_1.__importDefault(require("fs"));
const ScheduleRequestAccept_1 = require("../buttons/ScheduleRequestAccept");
const ScheduleRequestDeny_1 = require("../buttons/ScheduleRequestDeny");
class TeamListMenu extends discord_js_1.SelectMenuBuilder {
    constructor(issuerTeam) {
        super();
        this.setCustomId("schedreqTeams");
        const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        let teamsList = teamsDb.filter(pclTeam => {
            return pclTeam.schedulingChannel && !pclTeam.confidential;
        });
        const teamsInOrder = teamsList.filter(team => {
            return team.rank === issuerTeam.rank;
        });
        for (const team of teamsList) {
            if (!teamsInOrder.includes(team)) {
                teamsInOrder.push(team);
            }
        }
        for (const team of teamsInOrder) {
            this.addOptions({
                label: team.name,
                value: `schedreq${team.name}`
            });
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
    constructor(issuerTeam) {
        super();
        this.setComponents(new TeamListMenu(issuerTeam));
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