import { CacheType, Client, CommandInteraction } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordCommand } from "../../DiscordCommand";
import { ScheduleRequestRemove } from "./Remove";
import { ScheduleRequestCreate } from "./Create";

export default class ScheduleRequestCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties.setName("schedule_request").setDescription("Set up a match with another team");
        this.properties.addSubcommand(new ScheduleRequestRemove)
        this.properties.addSubcommand(new ScheduleRequestCreate);
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {}
}
