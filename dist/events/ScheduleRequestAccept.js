"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleScheduleRequestAccept = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
async function HandleScheduleRequestAccept(teamBot, interaction) {
    const scheduleRequests = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
    const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
    const schedReq = scheduleRequests.find((schedreq) => {
        return interaction.message.id == schedreq.captainMsgId;
    });
    const accepterTeam = scheduleRequests.find((schedreq) => {
        return schedreq.captainMsgId === interaction.message.id;
    }).opponent;
    const accepterChanId = registeredTeams.find((pclTeam) => {
        return pclTeam.name == accepterTeam;
    }).schedulingChannel;
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
        requesterSchedulingChan.send("normally i would fill up this channel with reactions but i dont feel like it");
        accepeterSchedulingChan.send("normally i would fill up this channel with reactions but i dont feel like it");
    }
    catch {
    }
}
exports.HandleScheduleRequestAccept = HandleScheduleRequestAccept;
//# sourceMappingURL=ScheduleRequestAccept.js.map