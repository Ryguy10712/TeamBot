"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamBot = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const ReadyListener_1 = require("./discord/listeners/ReadyListener");
const InteractionCreateListener_1 = require("./discord/listeners/InteractionCreateListener");
const PingCommand_1 = require("./discord/commands/PingCommand");
const PongCommand_1 = require("./discord/commands/PongCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
const RegisterCommand_1 = tslib_1.__importDefault(require("./discord/commands/RegisterCommand"));
const RegisterTeamCommand_1 = tslib_1.__importDefault(require("./discord/commands/RegisterTeamCommand"));
const TeamMenuCommand_1 = tslib_1.__importDefault(require("./discord/commands/TeamMenuCommand"));
const DeleteTeamCommand_1 = tslib_1.__importDefault(require("./discord/commands/DeleteTeamCommand"));
const TeamInfoCommand_1 = tslib_1.__importDefault(require("./discord/commands/TeamInfoCommand"));
const ScheduleRequestCommand_1 = tslib_1.__importDefault(require("./discord/commands/ScheduleRequestCommand"));
const SchedulingChannelCommand_1 = require("./discord/commands/SchedulingChannelCommand");
const MessageReactionAddListener_1 = require("./discord/listeners/MessageReactionAddListener");
const ReactionRemoveListener_1 = require("./discord/listeners/ReactionRemoveListener");
const ScheduleRequestAccept_1 = require("./discord/buttons/ScheduleRequestAccept");
const ScheduleRequestDeny_1 = require("./discord/buttons/ScheduleRequestDeny");
const AddToTeamCommand_1 = require("./discord/commands/context/AddToTeamCommand");
const RemoveFromTeamCommand_1 = require("./discord/commands/context/RemoveFromTeamCommand");
dotenv_1.default.config();
class TeamBot {
    client;
    commands;
    persistentButtons;
    rest;
    constructor() {
        this.rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.TOKEN);
        this.client = new discord_js_1.Client({
            intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMessageReactions", "DirectMessageReactions"],
            partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Reaction]
        });
        this.commands = new Map();
        this.persistentButtons = new Map();
        this.registerListener(new ReadyListener_1.ReadyListener());
        this.registerListener(new InteractionCreateListener_1.InteractionCreateListener());
        this.registerListener(new MessageReactionAddListener_1.MessageReactionAddListender());
        this.registerListener(new ReactionRemoveListener_1.ReactionRemoveListener());
        this.initCommand(new RegisterCommand_1.default());
        this.initCommand(new RegisterTeamCommand_1.default());
        this.initCommand(new TeamMenuCommand_1.default());
        this.initCommand(new PingCommand_1.PingCommand());
        this.initCommand(new PongCommand_1.PongCommand());
        this.initCommand(new DeleteTeamCommand_1.default());
        this.initCommand(new TeamInfoCommand_1.default());
        this.initCommand(new SchedulingChannelCommand_1.SchedulingChannelCommand());
        this.initCommand(new ScheduleRequestCommand_1.default());
        this.initCommand(new AddToTeamCommand_1.AddToTeamCommand());
        this.initCommand(new RemoveFromTeamCommand_1.RemoveFromTeamCommand());
        this.initButton(new ScheduleRequestAccept_1.ScheduleRequestAcceptButton());
        this.initButton(new ScheduleRequestDeny_1.ScheduleRequestDenyButton());
    }
    async start() {
        await this.client.login(process.env.TOKEN);
    }
    registerListener(discordListener) {
        discordListener.startListener(this);
    }
    initCommand(discordCommand) {
        this.commands.set(discordCommand.properties.name, discordCommand);
    }
    initButton(discordButton) {
        this.persistentButtons.set(discordButton.id, discordButton);
    }
    findPCLPlayerByDiscord(discordId) {
        const registeredPlayers = JSON.parse(fs_1.default.readFileSync("./db/registeredPlayers.json", "utf-8"));
        return registeredPlayers.find((PCLPlayer) => {
            return PCLPlayer.discordID === discordId;
        });
    }
    findPCLPlayerByOculus(oculusId) {
        const registeredPlayers = JSON.parse(fs_1.default.readFileSync("./db/registeredPlayers.json", "utf-8"));
        return registeredPlayers.find((PCLPlayer) => {
            return PCLPlayer.oculusId === oculusId;
        });
    }
    findTeamByCoCap(discordId) {
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        return registeredTeams.find((PCLTeam) => {
            return PCLTeam.captain === discordId;
        });
    }
}
exports.TeamBot = TeamBot;
(async () => {
    try {
        const teamBot = new TeamBot();
        teamBot.start();
    }
    catch (e) {
        console.error(e);
    }
})();
//# sourceMappingURL=Bot.js.map