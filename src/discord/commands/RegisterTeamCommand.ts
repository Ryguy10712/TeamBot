import {
    Client,
    CommandInteraction,
    CacheType,
    SlashCommandMentionableOption,
    SlashCommandStringOption,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    SlashCommandBooleanOption,
} from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { TeamBot } from "../../Bot";
import * as Embeds from "../embeds/RegisterTeamEmbeds";
import { Ranks } from "../../types";

export default class RegisterTeamCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties
            .setName("register_team")
            .setDescription("adds your team to the database")
            .addStringOption(new SlashCommandStringOption().setName("team_name").setDescription("the name of your team").setRequired(true))
            .addBooleanOption(new SlashCommandBooleanOption().setName("confidential").setDescription("set as true if this team is a secret").setRequired(true))
            .addMentionableOption(new SlashCommandMentionableOption().setName("cocap_discord").setDescription("the co-captain of your team"))
            .addStringOption(new SlashCommandStringOption().setName("cocap_oculus").setDescription("use co_cap discord if you can"))
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("rank")
                    .setDescription("leave blank if you are unranked")
                    .setChoices({ name: "Gold", value: "Gold" }, { name: "Silver", value: "Silver" }, { name: "Bronze", value: "Bronze" })
            );
        this.actionRows.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("YES").setCustomId("0yes").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setLabel("NO").setCustomId("0no").setStyle(ButtonStyle.Danger)
            )
        );
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const discordResponse = interaction.options.get("cocap_discord")?.value as string;
        const stringResponse = interaction.options.get("cocap_oculus")?.value as string;
        const teamName = interaction.options.get("team_name")?.value as string;
        const confidentiality = interaction.options.get("confidential")?.value as boolean;
        const teamRank = interaction.options.get("rank")?.value as string | undefined;

        const player = await teamBot.prisma.player.findFirst({
            where: { discordId: interaction.user.id },
            include: { team: true },
        });
        if (!player) {
            interaction.reply({ embeds: [Embeds.NotRegisteredError], ephemeral: true });
            return;
        }
        if (player?.team) {
            interaction.reply({ embeds: [Embeds.AlreadyCaptainError], ephemeral: true });
            return;
        }

        //determine co cap
        let coCaptainId: string | undefined = undefined;
        if (discordResponse) {
            coCaptainId = discordResponse;
        } else if (stringResponse) {
            const potential = await teamBot.prisma.player.findFirst({ where: { oculusId: stringResponse } });
            if (!potential) {
                interaction.reply({ embeds: [Embeds.CoCapNotRegisteredError], ephemeral: true });
                return;
            }
            coCaptainId = potential.discordId;
        }

        //determine rank
        let rank: any = undefined;
        switch (teamRank) {
            case "Gold":
                rank = Ranks.GOLD;
                break;
            case "Silver":
                rank = Ranks.SILVER;
                break;
            case "Bronze":
                rank = Ranks.BRONZE;
                break;
        }

        if (coCaptainId) {
            teamBot.prisma.team
                .create({
                    data: {
                        name: teamName,
                        confidential: confidentiality,
                        rank: rank,
                        players: {
                            connectOrCreate: [
                                {
                                    where: { playerId: interaction.user.id },
                                    create: {
                                        playerId: interaction.user.id,
                                        isCaptain: true,
                                        isCoCap: false,
                                    },
                                },
                                {
                                    where: { playerId: coCaptainId },
                                    create: {
                                        playerId: coCaptainId,
                                        isCaptain: false,
                                        isCoCap: true,
                                    },
                                },
                            ],
                        },
                    },
                })
                .then(async (teamRef) => {
                    await interaction.reply({ embeds: [new Embeds.TeamCreateSuccess(teamName, coCaptainId, teamRank)], ephemeral: true });
                    await teamBot.prisma.$disconnect();
                })
                .catch(() => {
                    interaction.reply({ content: "An unexpected error occured", ephemeral: true });
                });
        } else {
            teamBot.prisma.team
                .create({
                    data: {
                        name: teamName,
                        confidential: confidentiality,
                        rank: rank,
                        players: {
                            connectOrCreate: {
                                where: { playerId: interaction.user.id },
                                create: {
                                    playerId: interaction.user.id,
                                    isCaptain: true,
                                    isCoCap: false,
                                },
                            },
                        },
                    },
                })
                .then(async (teamRef) => {
                    await interaction.reply({ embeds: [new Embeds.TeamCreateSuccess(teamName, coCaptainId, teamRank)], ephemeral: true });
                    await teamBot.prisma.$disconnect();
                })
                .catch((e) => {
                    teamBot.log("unique constraint violation when creating team", false)
                    if(e.code === "P2002"){ //unique constraint failed
                        interaction.reply({embeds: [new Embeds.UniqueConstraintViolation], ephemeral: true})
                    } else {
                        interaction.reply({ content: "An unexpected error occured", ephemeral: true });
                    }
                    
                });
        }
    }
}
