import { chatInputApplicationCommandMention, Client, REST, Routes, SystemChannelFlagsBitField } from "discord.js";
import dotenv from "dotenv";
import { DiscordCommand } from "./discord/DiscordCommand";
import { DiscordListener } from "./discord/DiscordListener";
import { ReadyListener } from "./discord/listeners/ReadyListener";
import { InteractionCreateListener } from "./discord/listeners/InteractionCreateListener";
import { PingCommand } from "./discord/commands/PingCommand";
import { PongCommand } from "./discord/commands/PongCommand";
import fs from "fs";
import RegisterCommand from "./discord/commands/RegisterCommand";
import RegisterTeamCommand from "./discord/commands/RegisterTeamCommand";
import PCLPlayer from "./interfaces/PCLPlayer";
dotenv.config();

export class TeamBot {
    public readonly client: Client;
    public readonly commands: Map<String, DiscordCommand>;
    public readonly rest: REST;

    constructor() {
        this.rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

        this.client = new Client({
            intents: ["Guilds", "GuildMembers", "MessageContent", "GuildMessages", "DirectMessages", "GuildMessageReactions", "DirectMessageReactions"],
        });
        this.commands = new Map<string, DiscordCommand>();

        this.registerListener(new ReadyListener());
        this.registerListener(new InteractionCreateListener());

        //initializing all commands
        this.initCommand(new RegisterCommand());
        this.initCommand(new RegisterTeamCommand());
    }

    async start(): Promise<void> {
        await this.client.login(process.env.TOKEN);
    }

    registerListener(discordListener: DiscordListener): void {
        discordListener.startListener(this);
    }

    initCommand(discordCommand: DiscordCommand) {
        this.commands.set(discordCommand.properties.name, discordCommand);
    }

    findPCLPlayerByDiscord(discordId: string): PCLPlayer | undefined {
        const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
        return registeredPlayers.find((PCLPlayer) => {
            return PCLPlayer.discordID === discordId;
        });
    }

    findPCLPlayerByOculus(oculusId: string): PCLPlayer | undefined {
        const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
        return registeredPlayers.find((PCLPlayer) => {
            return PCLPlayer.oculusId === oculusId;
        });
    }
}

(async () => {
    try {
        const teamBot = new TeamBot();
        teamBot.start();
    } catch (e) {
        console.error(e);
    }
})();
