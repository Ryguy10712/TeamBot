"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRequestAcceptButton = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordButton_1 = require("../DiscordButton");
const fs_1 = tslib_1.__importDefault(require("fs"));
const RequestAcceptComponents_1 = require("../components/RequestAcceptComponents");
const ScheduleRequestComponents_1 = require("../components/ScheduleRequestComponents");
class ScheduleRequestAcceptButton extends DiscordButton_1.DiscordButton {
    id;
    constructor() {
        super();
        this.id = "schedreqAccept";
        this.setLabel("Accept");
        this.setStyle(discord_js_1.ButtonStyle.Success);
        this.setCustomId(this.id);
    }
    async execute(teamBot, client, interaction) {
        const scheduleRequests = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const schedReq = scheduleRequests.find((schedreq) => {
            return interaction.message.id == schedreq.captainMsgId;
        });
        if (!schedReq)
            return interaction.reply("this schedule request is no longer available");
        const requesterCaptainId = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.requester;
        }).captain;
        const requesterCoCaptainId = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.requester;
        }).coCap;
        const requesterCaptainUser = await client.users.fetch(requesterCaptainId);
        const requesterCoCaptainUser = requesterCoCaptainId ? await client.users.fetch(requesterCoCaptainId) : null;
        requesterCaptainUser.send("THE REQUEST HAS BEEN ACCEPTED RAHHHHHH");
        interaction.deferUpdate();
        interaction.message.edit({ components: [new ScheduleRequestComponents_1.RequestRow(false)] });
        if (requesterCoCaptainUser)
            requesterCoCaptainUser.send("THE SCHEDULE REQUEST HAS BEEN ACCEPTED RAHHH (you are a stinky co captain)");
        const requesterPclTeam = registeredTeams.find(pclTeam => { return pclTeam.name === schedReq.requester; });
        const accepterPclTeam = registeredTeams.find(pclTeam => { return pclTeam.name === schedReq.opponent; });
        const requesterSchedulingChan = await client.channels.fetch(requesterPclTeam.schedulingChannel);
        const accepeterSchedulingChan = await client.channels.fetch(accepterPclTeam.schedulingChannel);
        try {
            requesterSchedulingChan.send({ embeds: [new RequestAcceptComponents_1.MatchOrganizerEmbed(requesterPclTeam, accepterPclTeam, schedReq.type)], components: [new RequestAcceptComponents_1.UpdateButtonRow(schedReq.id, teamBot)] });
            accepeterSchedulingChan.send({ embeds: [new RequestAcceptComponents_1.MatchOrganizerEmbed(accepterPclTeam, requesterPclTeam, schedReq.type)], components: [new RequestAcceptComponents_1.UpdateButtonRow(schedReq.id, teamBot)] });
        }
        catch {
        }
    }
}
exports.ScheduleRequestAcceptButton = ScheduleRequestAcceptButton;
//# sourceMappingURL=ScheduleRequestAccept.js.map