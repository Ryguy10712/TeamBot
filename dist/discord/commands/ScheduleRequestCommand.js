"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
const ScheduleRequestComponents_1 = require("../components/ScheduleRequestComponents");
const ScheduleRequest_1 = require("../../interfaces/ScheduleRequest");
class ScheduleRequestCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties.setName("schedule_request").setDescription("poopoo pee pee cacac");
    }
    async executeInteraction(client, interaction, teamBot) {
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        const issuerPlayer = teamBot.findPCLPlayerByDiscord(interaction.user.id);
        if (!registeredTeams.some((pclPlayer) => {
            return pclPlayer.captain === interaction.user.id || pclPlayer.coCap === interaction.user.id;
        })) {
            return interaction.reply("poopoo");
        }
        const issuerTeam = registeredTeams.find((pclTeam) => {
            return pclTeam.captain === interaction.user.id || pclTeam.coCap === interaction.user.id;
        });
        if (!issuerTeam.schedulingChannel)
            return interaction.reply("In order to use this command you must have a scheduling channel");
        let TeamListMenuParams = [];
        for (const team of registeredTeams) {
            if (team.rank === issuerTeam.rank && team.schedulingChannel) {
                const option = new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel(team.name)
                    .setValue(`schedreq${team.name}`);
                TeamListMenuParams.push(option);
            }
        }
        const menu = new ScheduleRequestComponents_1.TeamListMenu(TeamListMenuParams);
        const reply = await interaction.reply({ components: [new ScheduleRequestComponents_1.TeamListRow(menu), new ScheduleRequestComponents_1.MatchTypeRow], content: "poopoo" });
        let selectedTeam = undefined;
        const menuFilter = (i) => {
            if (i.deferred || i.customId != "schedreqTeams")
                return false;
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };
        const menuCollector = reply.createMessageComponentCollector({ filter: menuFilter, componentType: discord_js_1.ComponentType.StringSelect, time: 120_000 });
        menuCollector.on("collect", menuInteraction => {
            selectedTeam = menuInteraction.values[0].replace("schedreq", "");
        });
        const buttonFilter = (i) => {
            return i.user.id === interaction.user.id;
        };
        const buttonInteraction = await reply.awaitMessageComponent({ filter: buttonFilter, componentType: discord_js_1.ComponentType.Button, time: 120_000 }).catch(() => { return; });
        if (!buttonInteraction)
            return interaction.followUp("Interaction Disposed");
        if (!selectedTeam)
            return interaction.followUp("Select a team first");
        let matchType;
        if (buttonInteraction.customId === "schedreqMatch")
            matchType = ScheduleRequest_1.MatchType.MATCH;
        if (buttonInteraction.customId === "schedreqChallenge")
            matchType = ScheduleRequest_1.MatchType.CHALLENGE;
        if (buttonInteraction.customId === "schedreqScrim")
            matchType = ScheduleRequest_1.MatchType.SCRIM;
        let registeredMatches = JSON.parse(fs_1.default.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const requestId = registeredMatches.length == 0 ? 0 : registeredMatches[registeredMatches.length - 1].id + 1;
        const opponentCaptainId = registeredTeams.find(pclTeam => { return pclTeam.name === selectedTeam; }).captain;
        const opponentCoCaptainId = registeredTeams.find(pclTeam => { return pclTeam.name === selectedTeam; }).coCap;
        const opponentCaptainUser = await client.users.fetch(opponentCaptainId);
        const opponentCoCaptainUser = opponentCoCaptainId ? await client.users.fetch(opponentCoCaptainId) : null;
        const capMsg = await opponentCaptainUser.send({ content: "this is maybe a scheduling request", components: [new ScheduleRequestComponents_1.RequestRow()] });
        const coCapMsg = opponentCoCaptainUser ? await opponentCoCaptainUser.send("||RUNRUNRUNRUN||") : null;
        buttonInteraction.followUp({ content: "Request Sent", ephemeral: true });
        buttonInteraction.replied = true;
        const schedRequest = coCapMsg ? {
            id: requestId,
            requester: issuerTeam.name,
            opponent: selectedTeam,
            captainMsgId: capMsg.id,
            coCaptainMsgId: coCapMsg.id,
            requestChanId: capMsg.channelId,
            type: matchType,
            accepted: false
        } : {
            id: requestId,
            requester: issuerTeam.name,
            opponent: selectedTeam,
            captainMsgId: capMsg.id,
            coCaptainMsgId: null,
            requestChanId: capMsg.channelId,
            type: matchType,
            accepted: false
        };
        registeredMatches.push(schedRequest);
        fs_1.default.writeFileSync("./db/scheduleRequests.json", JSON.stringify(registeredMatches));
    }
}
exports.default = ScheduleRequestCommand;
//# sourceMappingURL=ScheduleRequestCommand.js.map