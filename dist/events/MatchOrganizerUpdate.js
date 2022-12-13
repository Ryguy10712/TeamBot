"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
async function execute(teamBot, interaction) {
    const schedReqDb = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
    const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
    const schedReqId = parseInt(interaction.customId.replace("matchOrganizerUdate", ""));
    const schedReq = schedReqDb.find(schedReq => { schedReq.id === schedReqId; });
    if (!schedReq)
        return interaction.reply("this is no longer available");
    const requesterTeam = teamsDb.find(pclTeam => { pclTeam.name === schedReq.requester; });
    const accepterTeam = teamsDb.find(pclTeam => { pclTeam.name === schedReq.opponent; });
    if (!requesterTeam)
        return interaction.reply(`${schedReq.requester} is no longer a team`);
    if (!accepterTeam)
        return interaction.reply(`${schedReq.opponent} is no longer a team`);
}
exports.execute = execute;
//# sourceMappingURL=MatchOrganizerUpdate.js.map