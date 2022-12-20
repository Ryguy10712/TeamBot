"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRequestDenyButton = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordButton_1 = require("../DiscordButton");
const fs_1 = tslib_1.__importDefault(require("fs"));
class ScheduleRequestDenyButton extends DiscordButton_1.DiscordButton {
    id;
    constructor() {
        super();
        this.id = "schedreqDeny";
        this.setLabel("Decline");
        this.setStyle(discord_js_1.ButtonStyle.Danger);
        this.setCustomId(this.id);
    }
    async execute(teamBot, client, interaction) {
        const schedReqDb = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const schedReq = schedReqDb.find((schedReq) => {
            return schedReq.captainMsgId === interaction.message.id || schedReq.coCaptainMsgId === interaction.message.id;
        });
        schedReqDb.splice(schedReqDb.indexOf(schedReq), 1);
        fs_1.default.writeFileSync("./db/scheduleRequests.json", JSON.stringify(schedReqDb));
        const requesterTeam = teamsDb.find(pclTeam => { return pclTeam.name === schedReq.requester; });
        const declinerTeam = teamsDb.find(pclTeam => { return pclTeam.name === schedReq.opponent; });
        const requestChannel = await client.channels.fetch(schedReq.requestChanId);
        const requestMsg = await requestChannel.messages.fetch(schedReq.captainMsgId);
        requestMsg.reply("this has been denied");
    }
}
exports.ScheduleRequestDenyButton = ScheduleRequestDenyButton;
//# sourceMappingURL=ScheduleRequestDeny.js.map