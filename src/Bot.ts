import { Client, Partials, REST, Routes, SystemChannelFlagsBitField } from "discord.js";
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
import TeamMenuCommand from "./discord/commands/TeamMenuCommand";
import DeleteTeamCommand from "./discord/commands/DeleteTeamCommand";
import { PCLTeam } from "./interfaces/PCLTeam";
import TeamInfoCommand from "./discord/commands/TeamInfoCommand";
import ScheduleRequestCommand from "./discord/commands/ScheduleRequestCommand";
import { SchedulingChannelCommand } from "./discord/commands/SchedulingChannelCommand";
import { MessageReactionAddListender } from "./discord/listeners/MessageReactionAddListener";
import { ReactionRemoveListener } from "./discord/listeners/ReactionRemoveListener";
import { DiscordButton } from "./discord/DiscordButton";
import { ScheduleRequestAcceptButton } from "./discord/buttons/ScheduleRequestAccept";
import { ScheduleRequestDenyButton } from "./discord/buttons/ScheduleRequestDeny";
import { DiscordContextMenu } from "./discord/DiscordContextMenu";
import { AddToTeamCommand } from "./discord/commands/context/AddToTeamCommand";
import { GuildJoinListener } from "./discord/listeners/GuildJoinListener";
import { RemoveFromTeamCommand } from "./discord/commands/context/RemoveFromTeamCommand";
import { SetCoCapCommand } from "./discord/commands/context/SetCoCapCommand";
import { AvailabilityReset } from "./events/AvailabilityReset";
import { TeamAvailabilityCommand } from "./discord/commands/TeamAvailability";
import { ResetAvailability } from "./discord/commands/admin/ResetAvailability";
dotenv.config();

export class TeamBot {
    public readonly client: Client;
    public readonly commands: Map<String, DiscordCommand | DiscordContextMenu>;
    public readonly persistentButtons: Map<string, DiscordButton>;
    public readonly rest: REST;

    constructor() {
        this.rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

        this.client = new Client({
            intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMessageReactions", "DirectMessageReactions"],
            partials: [Partials.Message, Partials.Reaction],
        });
        this.commands = new Map<string, DiscordCommand | DiscordContextMenu>();
        this.persistentButtons = new Map<string, DiscordButton>();

        this.registerListener(new ReadyListener());
        this.registerListener(new InteractionCreateListener());
        this.registerListener(new MessageReactionAddListender());
        this.registerListener(new ReactionRemoveListener());
        this.registerListener(new GuildJoinListener());

        //initializing all commands
        this.initCommand(new RegisterCommand());
        this.initCommand(new RegisterTeamCommand());
        this.initCommand(new TeamMenuCommand());
        this.initCommand(new PingCommand());
        this.initCommand(new PongCommand());
        this.initCommand(new DeleteTeamCommand());
        this.initCommand(new TeamInfoCommand());
        this.initCommand(new SchedulingChannelCommand());
        this.initCommand(new ScheduleRequestCommand());
        this.initCommand(new AddToTeamCommand());
        this.initCommand(new RemoveFromTeamCommand());
        this.initCommand(new SetCoCapCommand());
        this.initCommand(new TeamAvailabilityCommand());
        this.initCommand(new ResetAvailability());

        this.initButton(new ScheduleRequestAcceptButton());
        this.initButton(new ScheduleRequestDenyButton());
    }

    async start(): Promise<void> {
        await this.client.login(process.env.TOKEN);
        //initialize cron jobs
        AvailabilityReset(this)
    }

    registerListener(discordListener: DiscordListener): void {
        discordListener.startListener(this);
    }

    initCommand(discordCommand: DiscordCommand | DiscordContextMenu) {
        this.commands.set(discordCommand.properties.name, discordCommand);
    }

    initButton(discordButton: DiscordButton) {
        this.persistentButtons.set(discordButton.id, discordButton);
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

    findTeamByCaptain(discordId: string): PCLTeam | undefined {
        const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        return registeredTeams.find((PCLTeam) => {
            return PCLTeam.captain === discordId;
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
