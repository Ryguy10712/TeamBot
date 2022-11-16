"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamBot = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const ReadyListener_1 = require("./discord/listeners/ReadyListener");
const InteractionCreateListener_1 = require("./discord/listeners/InteractionCreateListener");
const fs_1 = tslib_1.__importDefault(require("fs"));
const RegisterCommand_1 = tslib_1.__importDefault(require("./discord/commands/RegisterCommand"));
const RegisterTeamCommand_1 = tslib_1.__importDefault(require("./discord/commands/RegisterTeamCommand"));
dotenv_1.default.config();
class TeamBot {
    client;
    commands;
    rest;
    constructor() {
        this.rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.TOKEN);
        this.client = new discord_js_1.Client({
            intents: ["Guilds", "GuildMembers", "MessageContent", "GuildMessages", "DirectMessages", "GuildMessageReactions", "DirectMessageReactions"],
        });
        this.commands = new Map();
        this.registerListener(new ReadyListener_1.ReadyListener());
        this.registerListener(new InteractionCreateListener_1.InteractionCreateListener());
        this.initCommand(new RegisterCommand_1.default());
        this.initCommand(new RegisterTeamCommand_1.default());
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