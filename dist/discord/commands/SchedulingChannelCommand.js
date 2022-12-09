"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingChannelCommand = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
class SchedulingChannelCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties
            .setName("scheduling_channel")
            .setDescription("this is required to make scheduling requests")
            .addChannelOption(new discord_js_1.SlashCommandChannelOption().setName("channel").setDescription("make sure you are in your team's server").setRequired(true));
    }
    async executeInteraction(client, interaction, teamBot) {
        interaction.deferReply();
        const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        const channel = interaction.options.get("channel").value;
        let teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        let issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.captain === interaction.user.id || pclTeam.coCap === interaction.user.id;
        });
        if (!issuerTeam)
            return interaction.reply("you are not part of a team");
        teamsDb.find((pclTeam) => {
            return pclTeam.name === issuerTeam.name;
        }).schedulingChannel = channel;
        const guildChan = (await client.channels.fetch(channel));
        const messages = [];
        messages.push(await guildChan.send("Tuesday"), await guildChan.send("Wednesday"), await guildChan.send("Thursday"), await guildChan.send("Friday"), await guildChan.send("Saturday"), await guildChan.send("Sunday"), await guildChan.send("Monday"));
        const teamAvailability = {
            messageIds: [],
            tuesday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            wednesday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            thursday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            friday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            saturday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            sunday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
            monday: { "1️⃣": [], "2️⃣": [], "3️⃣": [], "4️⃣": [], "5️⃣": [], "6️⃣": [], "7️⃣": [], "8️⃣": [], "9️⃣": [], "🔟": [], "🕚": [], "🕛": [] },
        };
        for (const message of messages) {
            teamAvailability.messageIds.push(message.id);
            for (const reaction of REACTIONS) {
                message.react(reaction);
            }
            message.react("❌");
        }
        teamsDb.find((pclTeam) => {
            return pclTeam.name === issuerTeam.name;
        }).availability = teamAvailability;
        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        interaction.followUp("Success");
    }
}
exports.SchedulingChannelCommand = SchedulingChannelCommand;
//# sourceMappingURL=SchedulingChannelCommand.js.map