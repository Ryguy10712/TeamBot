import { Client, Partials, REST } from "discord.js";
import dotenv from "dotenv";
import { DiscordCommand } from "./discord/DiscordCommand";
import { DiscordListener } from "./discord/DiscordListener";
import { ReadyListener } from "./discord/listeners/ReadyListener";
import { InteractionCreateListener } from "./discord/listeners/InteractionCreateListener";
import { PingCommand } from "./discord/commands/PingCommand";
import { PongCommand } from "./discord/commands/PongCommand";
import fs from "node:fs/promises";
import RegisterCommand from "./discord/commands/RegisterCommand";
import RegisterTeamCommand from "./discord/commands/RegisterTeamCommand";
import TeamMenuCommand from "./discord/commands/TeamMenuCommand";
import DeleteTeamCommand from "./discord/commands/DeleteTeamCommand";
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
import { RefreshAvailabilityCommand } from "./discord/commands/RefreshAvailability";
import { PrismaClient } from "@prisma/client";
import { SlowQuery } from "./utils/ReactionQueue";
import { HelpCommand } from "./discord/commands/HelpCommand";
dotenv.config();

export class TeamBot {
    public readonly client: Client;
    public readonly commands: Map<String, DiscordCommand | DiscordContextMenu>;
    public readonly persistentButtons: Map<string, DiscordButton>;
    public readonly rest: REST;
    protected currentLogName: string;
    public readonly prisma: PrismaClient;
    public currentQueue: SlowQuery | null;
    public maintenanceMode: boolean

    constructor(maintenanceMode: boolean) {
        this.maintenanceMode = maintenanceMode
        this.currentLogName = new Date(Date.now()).toDateString();
        fs.writeFile(`./cache/${this.currentLogName}`, "");

        this.prisma = new PrismaClient({
            errorFormat: "minimal",
        });
        this.currentQueue = new SlowQuery(this);

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
        //this.initCommand(new ResetAvailability()); not needed
        //this.initCommand(new RefreshAvailabilityCommand()); deprecated
        this.initCommand(new HelpCommand(this.commands)) //always do this one last
        
        this.initButton(new ScheduleRequestAcceptButton());
        this.initButton(new ScheduleRequestDenyButton());
    }

    async start(): Promise<void> {
        await this.client.login(process.env.TOKEN);
        //initialize cron jobs
        AvailabilityReset(this);

        ///create error logger
        process.on("uncaughtException", (e) => {
            this.log(e, true);
        });
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

    async log(text: Error | string, isError: boolean) {
        let logFile = await fs.readFile(`./cache/${this.currentLogName}`, "utf-8");
        if (isError) {
            text = text as Error;
            const errorStr = `\nERROR!!!\n${text.name.toString()}\n${text.message.toString()}\n${
                text.cause
            }\n${text.stack?.toString()}\n################################`;
            fs.writeFile(`./cache/${this.currentLogName}`, (logFile += errorStr));
            console.error(errorStr);
        } else {
            text = text as string;
            logFile += "\n";
            fs.writeFile(`./cache/${this.currentLogName}`, (logFile += text));
            console.log(text);
        }
    }
}

(async () => {
    try {
        const teamBot = new TeamBot(false);
        teamBot.start();
    } catch (e) {
        console.error(e);
    }
})();


/**
 * huge thanks to
 * Painter
 * 3JRock
 * Bruhvy
 * kade
 * Recoil
 * and all my other helpers :)
 */
