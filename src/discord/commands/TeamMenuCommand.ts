import { Client, CommandInteraction, CacheType, SelectMenuInteraction, ComponentType, ButtonInteraction } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import * as Embeds from "../embeds/TeamMenuEmbeds";
import * as Components from "../components/TeamMenuComponents";
import { PlayerAlreadyOnEmbed, UserNotCaptainOrEmbed } from "../embeds/CommonEmbeds";

export default class TeamConfigCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties.setName("team_menu").setDescription("Edit various aspects of your team");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        //terminate if player is not registerd
        const issuer = await teamBot.prisma.teamPlayer.findFirst({
            where: {
                playerId: interaction.user.id,
                OR: [{ isCaptain: true }, { isCoCap: true }],
            },
        });
        if (!issuer) {
            interaction.reply({ embeds: [new UserNotCaptainOrEmbed()], ephemeral: true });
            return;
        }

        const reply = await interaction.reply({
            components: [new Components.TeamConfigRow(0), Components.AddPlayerButton],
            embeds: [Embeds.AddPlayerEmbed],
            ephemeral: true,
        });
        const menuFilter = (i: SelectMenuInteraction) => {
            if (i.deferred || i.customId != "teamcfgMenu") return false;
            i.deferUpdate();
            return i.user == interaction.user;
        };
        const buttonFilter = (i: ButtonInteraction) => {
            if (!i.customId.includes("teamcfg")) return false;
            return i.user === interaction.user;
        };
        const menuCollector = reply.createMessageComponentCollector({ filter: menuFilter, componentType: ComponentType.StringSelect, time: 120_000 });
        let selected: string;
        const buttonCollector = reply.createMessageComponentCollector({ filter: buttonFilter, componentType: ComponentType.Button, time: 120_000 });
        menuCollector.on("collect", (menuInteraction) => {
            selected = menuInteraction.values[0];
            switch (menuInteraction.values[0]) {
                case "addPlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(0), Components.AddPlayerButton], embeds: [Embeds.AddPlayerEmbed] });
                    break;
                case "removePlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(1), Components.RemovePlayerButton], embeds: [Embeds.RemovePlayerEmbed] });
                    break;
                case "setCoCap":
                    interaction.editReply({ components: [new Components.TeamConfigRow(2), Components.SetCoCapButton], embeds: [Embeds.SetCoCapEmbed] });
                    break;
                case "editName":
                    interaction.editReply({ components: [new Components.TeamConfigRow(3), Components.EditButton], embeds: [Embeds.EditNameEmbed] });
                    break;
                case "confidential":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(4), Components.ConfidentialityButtons],
                        embeds: [Embeds.ConfidentialityEmbed],
                    });
                    break;
                case "rank":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(5), Components.RankButtons],
                        embeds: [Embeds.RankEmbed],
                    });
                    break;
                case "availabilityVisibility":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(6), Components.ConfidentialityButtons],
                        embeds: [new Embeds.SetAvailabilityVisibilityEmbed()],
                    });
            }
        });

        buttonCollector.on("collect", async (buttonInteraction) => {
            switch (buttonInteraction.customId) {
                case "teamcfgAdd":
                    await buttonInteraction.showModal(Components.AddPlayerModal);
                    await buttonInteraction
                        .awaitModalSubmit({ time: 120_000 })
                        .then(async (modalData) => {
                            modalData.deferUpdate();
                            const response = modalData.fields.getTextInputValue("addPlayerText");
                            const candidate = await teamBot.prisma.player.findFirst({
                                where: { oculusId: response },
                                include: { team: { select: { teamId: true } } },
                            });
                            //check to see if the provided player is registered
                            if (!candidate) return interaction.editReply({ embeds: [Embeds.PlayerNotFoundError] });
                            //return if the provided player is already on a team
                            if (candidate.team) {
                                interaction.editReply({ embeds: [new PlayerAlreadyOnEmbed(response)] });
                                return;
                            }
                            //at this point the username is valid
                            teamBot.prisma.team
                                .update({
                                    where: { id: issuer.teamId },
                                    data: {
                                        players: {
                                            create: {
                                                playerId: candidate.discordId,
                                                isCaptain: false,
                                                isCoCap: false,
                                            },
                                        },
                                    },
                                })
                                .then(() => {
                                    interaction.editReply({ embeds: [Embeds.AddPlayerSuccess] });
                                    teamBot.prisma.$disconnect();
                                })
                                .catch(() => {
                                    interaction.editReply("An unexpected error has occured");
                                    teamBot.prisma.$disconnect();
                                });
                        })
                        .catch(() => {
                            //ignore timeout
                            return null;
                        });
                    break;

                case "teamcfgRemove":
                    buttonInteraction.showModal(Components.RemovePlayerModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 }).then(async (modalData) => {
                        modalData.deferUpdate();
                        const resposne = modalData.fields.getTextInputValue("removePlayerText");
                        const candidate = await teamBot.prisma.player.findFirst({
                            where: { oculusId: resposne },
                            include: { team: { select: { teamId: true } } },
                        });
                        if (!candidate) return interaction.editReply({ embeds: [Embeds.PlayerNotFoundError] });
                        if (candidate.team?.teamId != issuer.teamId) {
                            interaction.editReply({ embeds: [Embeds.PlayerNotOnError] });
                            return;
                        }
                        teamBot.prisma.teamPlayer
                            .delete({
                                where: { playerId: candidate.discordId },
                            })
                            .then(() => {
                                interaction.editReply({ embeds: [Embeds.RemovePlayerSuccess] });
                            })
                            .catch(() => {
                                interaction.editReply("An unexpected error occured");
                            });
                    });
                    break;

                case "teamcfgCoCap":
                    buttonInteraction.showModal(Components.SetCoCapModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 }).then(async (modalData) => {
                        modalData.deferUpdate();
                        const response = modalData.fields.getTextInputValue("setCoCapText");
                        const candidate = await teamBot.prisma.player.findFirst({
                            where: { oculusId: response },
                            include: { team: { select: { teamId: true } } },
                        });

                        if (!candidate) return interaction.editReply({ embeds: [Embeds.PlayerNotFoundError] });
                        if (candidate.team?.teamId != issuer.teamId) {
                            interaction.editReply({ embeds: [Embeds.PlayerNotOnError] });
                            return;
                        }
                        teamBot.prisma.teamPlayer
                            .update({
                                where: { playerId: candidate.discordId },
                                data: { isCoCap: true },
                            })
                            .then(() => {
                                interaction.editReply({ embeds: [new Embeds.SetCoCapSuccess(response)] });
                                teamBot.prisma.$disconnect();
                            })
                            .catch(() => {
                                interaction.editReply("An unexpected error occured");
                                teamBot.prisma.$disconnect();
                            });
                    });
                    break;

                case "teamcfgEdit":
                    buttonInteraction.showModal(Components.EditModal);
                    await buttonInteraction
                        .awaitModalSubmit({ time: 120_000 })
                        .then((modalData) => {
                            modalData.deferUpdate();
                            const response = modalData.fields.getTextInputValue("editText");
                            teamBot.prisma.team
                                .update({
                                    where: { id: issuer.teamId },
                                    data: { name: response },
                                })
                                .then(() => {
                                    interaction.editReply({ embeds: [Embeds.EditNameSuccess] });
                                    teamBot.prisma.$disconnect();
                                })
                                .catch(() => {
                                    interaction.editReply("An unexpected error occured");
                                    teamBot.prisma.$disconnect();
                                });
                        })
                        .catch(() => {
                            //ignore timeout
                            return null;
                        });
                    break;

                case "teamcfgTrue":
                    if (selected == "rank") {
                        teamBot.prisma.team
                            .update({
                                where: { id: issuer.teamId },
                                data: { confidential: true },
                            })
                            .then(() => {
                                interaction.editReply({ embeds: [Embeds.ConfidentialitySuccess] });
                                teamBot.prisma.$disconnect();
                            })
                            .catch(() => {
                                interaction.editReply("An unexpected error occured");
                                teamBot.prisma.$disconnect();
                            });
                    } else if (selected == "availabilityVisibility") {
                        teamBot.prisma.team.update({
                            where: { id: issuer.teamId },
                            data: { hidesAvailability: false },
                        })
                        .then(() => {teamBot.prisma.$disconnect()})
                        .catch(() => {
                            interaction.editReply("An unexpected error occured")
                            teamBot.prisma.$disconnect()
                        })
                    }
                    break;

                case "teamcfgFalse":
                    if (selected == "rank") {
                        teamBot.prisma.team
                            .update({
                                where: { id: issuer.teamId },
                                data: { confidential: false },
                            })
                            .then(() => {
                                interaction.editReply({ embeds: [Embeds.ConfidentialitySuccess] });
                                teamBot.prisma.$disconnect();
                            })
                            .catch(() => {
                                interaction.editReply("An unexpected error occured");
                                teamBot.prisma.$disconnect();
                            });
                    } else if (selected == "availabilityVisibility"){
                        teamBot.prisma.team.update({
                            where: {id: issuer.teamId},
                            data: {hidesAvailability: true}
                        })
                    }

                case "teamcfgGold":
                    teamBot.prisma.team
                        .update({
                            where: { id: issuer.teamId },
                            data: { rank: 0 },
                        })
                        .then(() => {
                            interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                            teamBot.prisma.$disconnect();
                        })
                        .catch(() => {
                            interaction.editReply("An unexpected error occured");
                            teamBot.prisma.$disconnect();
                        });
                    break;

                case "teamcfgSilver":
                    teamBot.prisma.team
                        .update({
                            where: { id: issuer.teamId },
                            data: { rank: 1 },
                        })
                        .then(() => {
                            interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                            teamBot.prisma.$disconnect();
                        })
                        .catch(() => {
                            interaction.editReply("An unexpected error occured");
                            teamBot.prisma.$disconnect();
                        });
                    break;

                case "teamcfgBronze":
                    teamBot.prisma.team
                        .update({
                            where: { id: issuer.teamId },
                            data: { rank: 2 },
                        })
                        .then(() => {
                            interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                            teamBot.prisma.$disconnect();
                        })
                        .catch(() => {
                            interaction.editReply("An unexpected error occured");
                            teamBot.prisma.$disconnect();
                        });
                    break;
            }
        });

        menuCollector.on("end", async () => {
            if (menuCollector.endReason != "time") return;
            interaction.editReply({ embeds: [Embeds.DisposedInteraction], components: [] });
        });
    }
}
