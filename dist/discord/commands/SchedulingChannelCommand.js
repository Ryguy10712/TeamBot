"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingChannelCommand = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const fs_1 = tslib_1.__importDefault(require("fs"));
const SchedChannelEmbeds_1 = require("../embeds/SchedChannelEmbeds");
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
        await interaction.deferReply();
        const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        const channel = interaction.options.get("channel").value;
        let teamsDb = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        let issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.captain === interaction.user.id || pclTeam.coCap === interaction.user.id;
        });
        if (!issuerTeam)
            return interaction.followUp({ embeds: [new SchedChannelEmbeds_1.NoTeamEmbed] });
        teamsDb.find((pclTeam) => {
            return pclTeam.name === issuerTeam.name;
        }).schedulingChannel = channel;
        const guildChan = (await client.channels.fetch(channel));
        if (guildChan.type != discord_js_1.ChannelType.GuildText)
            return interaction.followUp({ embeds: [new SchedChannelEmbeds_1.WrongChannelTypeEmbed()], ephemeral: true });
        const messages = [];
        try {
            messages.push(await guildChan.send("Tuesday"), await guildChan.send("Wednesday"), await guildChan.send("Thursday"), await guildChan.send("Friday"), await guildChan.send("Saturday"), await guildChan.send("Sunday"), await guildChan.send("Monday"));
        }
        catch (e) {
            interaction.followUp({ embeds: [new SchedChannelEmbeds_1.MissingAccessEmbed] });
            return;
        }
        const teamAvailability = {
            messageIds: [],
            tuesday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
            wednesday: {
                "1PM": [],
                "2PM": [],
                "3PM": [],
                "4PM": [],
                "5PM": [],
                "6PM": [],
                "7PM": [],
                "8PM": [],
                "9PM": [],
                "10PM": [],
                "11PM": [],
                "12PM": [],
            },
            thursday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
            friday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
            saturday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
            sunday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
            monday: { "1PM": [], "2PM": [], "3PM": [], "4PM": [], "5PM": [], "6PM": [], "7PM": [], "8PM": [], "9PM": [], "10PM": [], "11PM": [], "12PM": [] },
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
        interaction.followUp({ embeds: [new SchedChannelEmbeds_1.SchedChanSetEmbed(guildChan.id)] });
    }
}
exports.SchedulingChannelCommand = SchedulingChannelCommand;
//# sourceMappingURL=SchedulingChannelCommand.js.map