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
dotenv_1.default.config();
class TeamBot {
    client;
    commands;
    rest;
    constructor() {
        this.rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.TOKEN);
        this.client = new discord_js_1.Client({
            intents: ["Guilds", "GuildMembers", "MessageContent", "GuildMessages", "DirectMessages", "GuildMessageReactions", "DirectMessageReactions"],
        });
        this.commands = new Map();
        this.registerCommand(new PingCommand_1.PingCommand());
        this.registerCommand(new PongCommand_1.PongCommand());
        this.registerListener(new ReadyListener_1.ReadyListener);
        this.registerListener(new InteractionCreateListener_1.InteractionCreateListener);
    }
    async start() {
        await this.client.login(process.env.TOKEN);
    }
    registerListener(discordListener) {
        discordListener.startListener(this);
    }
    async registerCommand(discordCommand) {
        this.commands.set(discordCommand.properties.name, discordCommand);
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