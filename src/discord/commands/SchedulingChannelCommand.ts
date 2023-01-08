import {
    Client,
    CommandInteraction,
    CacheType,
    SlashCommandChannelOption,
    GuildTextBasedChannel,
    GuildChannel,
    ReactionCollector,
    ChannelType,
} from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import { PCLTeam, HourReaction } from "../../interfaces/PCLTeam";
import { MissingAccessEmbed, NoTeamEmbed, SchedChanSetEmbed, WrongChannelTypeEmbed } from "../embeds/SchedChannelEmbeds";

export class SchedulingChannelCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties
            .setName("scheduling_channel")
            .setDescription("this is required to make scheduling requests")
            .addChannelOption(new SlashCommandChannelOption().setName("channel").setDescription("make sure you are in your team's server").setRequired(true));
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        await interaction.deferReply();
        const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        const channelId = interaction.options.get("channel")!.value as string;
        const teamPlayer = await teamBot.prisma.teamPlayer.findFirst({
            where: {
                OR: [{isCaptain: true,},{isCoCap: true,}],
                AND: [{ playerId: interaction.user.id }],
            },
        });

        if(!teamPlayer){
            interaction.followUp({embeds: [new NoTeamEmbed], ephemeral: true});
            return;
        }

        //sending out the shizz
        const guildChan = (await client.channels.fetch(channelId))!;
        if (guildChan.type != ChannelType.GuildText) return interaction.followUp({ embeds: [new WrongChannelTypeEmbed()], ephemeral: true });
        const messages = [];
        try {
            messages.push(
                await guildChan.send("Tuesday"),
                await guildChan.send("Wednesday"),
                await guildChan.send("Thursday"),
                await guildChan.send("Friday"),
                await guildChan.send("Saturday"),
                await guildChan.send("Sunday"),
                await guildChan.send("Monday")
            );
        } catch (e) {
            interaction.followUp({ embeds: [new MissingAccessEmbed()] });
            return;
        }

        const teamAvailability: PCLTeam["availability"] = {
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

        //populating the messageIds
        for (const message of messages) {
            teamAvailability.messageIds.push(message.id);
            for (const reaction of REACTIONS) {
                message.react(reaction);
            }
            message.react("❌");
            message.react("❓");
        }

        try {
            await teamBot.prisma.team.update({
                where: {id: teamPlayer.teamId},
                data: {
                    availability: teamAvailability
                }
            })
            interaction.followUp({embeds: [new SchedChanSetEmbed(guildChan.id)], ephemeral: true})
            teamBot.prisma.$disconnect()
        } catch {
            teamBot.prisma.$disconnect()
            interaction.reply("An unexpected error occured")
        }
    }
}
