import { Client, CommandInteraction, CacheType, SlashCommandChannelOption, ChannelType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
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
        await interaction.deferReply({ ephemeral: true });
        const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
        const channelId = interaction.options.get("channel")!.value as string;
        const teamPlayer = await teamBot.prisma.teamPlayer.findFirst({
            where: {
                OR: [{ isCaptain: true }, { isCoCap: true }],
                AND: [{ playerId: interaction.user.id }],
            },
        });

        if (!teamPlayer) {
            interaction.followUp({ embeds: [new NoTeamEmbed()], ephemeral: true });
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

        for (const message of messages) {
            for (const reaction of REACTIONS) {
                message.react(reaction).catch(() => {
                    return;
                })
            }
            message.react("❌").catch(() => {return});
            message.react("❓").catch(() => {return;});
        }

        try {
            await teamBot.prisma.team.update({
                where: { id: teamPlayer.teamId },
                data: {
                    schedulingChannel: channelId,
                    availability: {
                        upsert: {
                            create: {
                                tuesday: messages[0].id,
                                wednesday: messages[1].id,
                                thursday: messages[2].id,
                                friday: messages[3].id,
                                saturday: messages[4].id,
                                sunday: messages[5].id,
                                monday: messages[6].id,
                            },
                            update: {
                                tuesday: messages[0].id,
                                wednesday: messages[1].id,
                                thursday: messages[2].id,
                                friday: messages[3].id,
                                saturday: messages[4].id,
                                sunday: messages[5].id,
                                monday: messages[6].id,
                            },
                        },
                    },
                },
            });
            teamBot.prisma.$disconnect();
            interaction.followUp({ embeds: [new SchedChanSetEmbed(guildChan.id)], ephemeral: true });
        } catch (e: any) {
            teamBot.log(e, true);
            teamBot.prisma.$disconnect();
            interaction.followUp("An unexpected error occured");
        }
    }
}
