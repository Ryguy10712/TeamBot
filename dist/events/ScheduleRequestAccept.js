"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleScheduleRequestAccept = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const RequestAcceptComponents_1 = require("../discord/components/RequestAcceptComponents");
async function HandleScheduleRequestAccept(teamBot, interaction) {
    const scheduleRequests = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
    const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
    const schedReq = scheduleRequests.find((schedreq) => {
        return interaction.message.id == schedreq.captainMsgId;
    });
    const requesterCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    }).captain;
    const requesterCoCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    }).coCap;
    const requesterCaptainUser = await teamBot.client.users.fetch(requesterCaptainId);
    const requesterCoCaptainUser = requesterCoCaptainId ? await teamBot.client.users.fetch(requesterCoCaptainId) : null;
    requesterCaptainUser.send("THE REQUEST HAS BEEN ACCEPTED RAHHHHHH");
    if (requesterCoCaptainUser)
        requesterCoCaptainUser.send("THE SCHEDULE REQUEST HAS BEEN ACCEPTED RAHHH (you are a stinky co captain)");
    const requesterPclTeam = registeredTeams.find(pclTeam => { return pclTeam.name === schedReq.requester; });
    const accepterPclTeam = registeredTeams.find(pclTeam => { return pclTeam.name === schedReq.opponent; });
    const requesterSchedulingChan = await teamBot.client.channels.fetch(requesterPclTeam.schedulingChannel);
    const accepeterSchedulingChan = await teamBot.client.channels.fetch(accepterPclTeam.schedulingChannel);
    try {
        requesterSchedulingChan.send({ embeds: [new RequestAcceptComponents_1.MatchOrganizerEmbed(requesterPclTeam, accepterPclTeam, schedReq.type)], components: [new RequestAcceptComponents_1.UpdateButtonRow(schedReq.id, teamBot)] });
        accepeterSchedulingChan.send({ embeds: [new RequestAcceptComponents_1.MatchOrganizerEmbed(accepterPclTeam, requesterPclTeam, schedReq.type)], components: [new RequestAcceptComponents_1.UpdateButtonRow(schedReq.id, teamBot)] });
    }
    catch {
    }
}
exports.HandleScheduleRequestAccept = HandleScheduleRequestAccept;
//# sourceMappingURL=ScheduleRequestAccept.js.map