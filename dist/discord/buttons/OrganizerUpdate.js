"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchOrganizerUpdateButton = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordButton_1 = require("../DiscordButton");
const RequestAcceptComponents_1 = require("../components/RequestAcceptComponents");
const fs_1 = tslib_1.__importDefault(require("fs"));
class MatchOrganizerUpdateButton extends DiscordButton_1.DiscordButton {
    id;
    constructor(scheduleRequestId) {
        super();
        this.id = `matchOrganizerUpdate${scheduleRequestId}`;
        this.setLabel("Update");
        this.setStyle(discord_js_1.ButtonStyle.Primary);
        this.setCustomId(this.id);
    }
    async execute(teamBot, client, interaction) {
        const schedReqDb = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const schedReqId = parseInt(interaction.customId.replace("matchOrganizerUpdate", ""));
        const schedReq = schedReqDb.find(schedReq => { return schedReq.id === schedReqId; });
        if (!schedReq)
            return interaction.reply("this is no longer available");
        const requesterTeam = teamsDb.find(pclTeam => { return pclTeam.name === schedReq.requester; });
        const accepterTeam = teamsDb.find(pclTeam => { return pclTeam.name === schedReq.opponent; });
        if (!requesterTeam)
            return interaction.reply(`${schedReq.requester} is no longer a team`);
        if (!accepterTeam)
            return interaction.reply(`${schedReq.opponent} is no longer a team`);
        const homeTeam = teamsDb.find(pclTeam => { return pclTeam.schedulingChannel === interaction.channelId; });
        const awayTeam = homeTeam == requesterTeam ? accepterTeam : requesterTeam;
        interaction.message.edit({ embeds: [new RequestAcceptComponents_1.MatchOrganizerEmbed(homeTeam, awayTeam, schedReq.type)] });
    }
}
exports.MatchOrganizerUpdateButton = MatchOrganizerUpdateButton;
//# sourceMappingURL=OrganizerUpdate.js.map