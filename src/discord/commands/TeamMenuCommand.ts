import { Client, CommandInteraction, CacheType, SelectMenuInteraction, ComponentType, ButtonInteraction } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import * as Embeds from "../embeds/TeamMenuEmbeds";
import * as Components from "../components/TeamMenuComponents";
import fs from "fs";
import { PCLTeam } from "../../interfaces/PCLTeam";
import { isoculusidClean } from "../../utils/StringSanatizers";

export default class TeamConfigCommand extends DiscordCommand {
    public inDev: boolean = true;

    constructor() {
        super();
        this.properties.setName("team_menu").setDescription("Edit various aspects of your team");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        let success: Boolean = false
        //terminate if player is not registerd
        if (!teamBot.findPCLPlayerByDiscord(interaction.user.id)) return interaction.reply({ embeds: [Embeds.NotRegisteredError] });
        let team = teamBot.findTeamByCoCap(interaction.user.id)
        if (!team) return interaction.reply({ embeds: [Embeds.NoTeamError] });

        const reply = await interaction.reply({ components: [new Components.TeamConfigRow(0), Components.AddPlayerButton], embeds: [Embeds.AddPlayerEmbed] });
        const menuFilter = (i: SelectMenuInteraction) => {
            if (i.deferred || i.customId != "teamcfgMenu") return false;
            i.deferUpdate();
            return i.user == interaction.user;
        };
        const buttonFilter = (i: ButtonInteraction) => {
            if (i.deferred || !i.customId.includes("teamcfg")) return false;
            return i.user === interaction.user;
        };
        const menuCollector = reply.createMessageComponentCollector({ filter: menuFilter, componentType: ComponentType.StringSelect, time: 120_000 });
        const buttonCollector = reply.createMessageComponentCollector({ filter: buttonFilter, componentType: ComponentType.Button, time: 120_000 });
        menuCollector.on("collect", (menuInteraction) => {
            switch (menuInteraction.values[0]) {
                case "addPlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(0), Components.RemovePlayerButton], embeds: [Embeds.AddPlayerEmbed] });
                    break;
                case "removePlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(1), Components.RemovePlayerButton], embeds: [Embeds.RemovePlayerEmbed] });
                    break;
                case "editName":
                    interaction.editReply({ components: [new Components.TeamConfigRow(2), Components.EditButton], embeds: [Embeds.EditNameEmbed] });
                    break;
                case "confidential":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(3), Components.ConfidentialityButtons],
                        embeds: [Embeds.ConfidentialityEmbed],
                    });
                    break;
                case "rank":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(4), Components.RankButtons],
                        embeds: [Embeds.RankEmbed]
                    })
            }
        });

        buttonCollector.on("collect", async (buttonInteraction) => {
            let registeredTeams: PCLTeam[]
            switch (buttonInteraction.customId) {
                case "teamcfgAdd":
                    buttonInteraction.showModal(Components.AddPlayerModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 })
                        .then((modalData) => {
                            modalData.deferUpdate()
                            const response = modalData.fields.getTextInputValue("addPlayerText");
                            const pclPlayer = teamBot.findPCLPlayerByOculus(response);
                            //check to see if the provided player is registered
                            if (!pclPlayer) return interaction.followUp({ embeds: [Embeds.PlayerNotFoundError] });
                            registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
                            //return if the provided player is already on a team
                            if (
                                registeredTeams.some((PCLTeam) => {
                                    return PCLTeam.players.includes(teamBot.findPCLPlayerByOculus(response)?.discordID!);
                                })
                            ) return interaction.followUp({ embeds: [Embeds.PlayerAlreadyOnError] });
                            //at this point the username is valid
                            registeredTeams.find(PCLTeam => {return PCLTeam.captain === buttonInteraction.user.id})?.players.push(pclPlayer.discordID)
                            fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                            team = teamBot.findTeamByCoCap(interaction.user.id)
                            interaction.followUp({embeds: [Embeds.AddPlayerSuccess]})
                            success = true;
                        })
                        .catch(() => { //ignore timeout
                            return null;
                        });
                    break;

                case "teamcfgRemove":
                    buttonInteraction.showModal(Components.RemovePlayerModal)
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 }).then(modalData => {
                        modalData.deferUpdate()
                        const resposne = modalData.fields.getTextInputValue("removePlayerText")
                        const playerForRemoval = teamBot.findPCLPlayerByOculus(resposne)?.discordID
                        if(!playerForRemoval) return interaction.followUp({embeds: [Embeds.PlayerNotFoundError]});
                        if(!team!.players.includes(playerForRemoval)) return interaction.followUp({embeds: [Embeds.PlayerNotOnError]})
                        registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                        registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.players = registeredTeams.find(PCLTeam => {return PCLTeam.name === team!.name})!.players.filter(player => {return player != playerForRemoval})
                        fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                        team = teamBot.findTeamByCoCap(interaction.user.id)
                        interaction.followUp({embeds: [Embeds.RemovePlayerSuccess]})
                        success = true;
                    })
                    break;

                case "teamcfgEdit":
                    buttonInteraction.showModal(Components.EditModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 })
                        .then((modalData) => {
                            modalData.deferUpdate()
                            const response = modalData.fields.getTextInputValue("editText")
                            registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                            registeredTeams.find(PCLTeam => {return PCLTeam.name === team!.name})!.name = response
                            fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                            team = teamBot.findTeamByCoCap(interaction.user.id)
                            interaction.followUp({embeds: [Embeds.EditNameSuccess]})
                            success = true
                        })
                        .catch(() => { //ignore timeout
                            return null;
                        });
                    break;

                case "teamcfgTrue":
                    buttonInteraction.deferUpdate()
                    registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                    registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.confidential = true;
                    fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                    team = teamBot.findTeamByCoCap(interaction.user.id)
                    interaction.followUp({embeds: [Embeds.ConfidentialitySuccess]})
                    success = true;
                    break;

                case "teamcfgFalse":
                    buttonInteraction.deferUpdate()
                    registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                    registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.confidential = false;
                    fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                    team = teamBot.findTeamByCoCap(interaction.user.id)
                    interaction.followUp({embeds: [Embeds.ConfidentialitySuccess]})
                    success = true;
                    break;

                case "teamcfgGold":
                    buttonInteraction.deferUpdate()
                    registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                    registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.rank = 0
                    fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                    team = teamBot.findTeamByCoCap(interaction.user.id)
                    interaction.followUp({embeds: [Embeds.RankSuccessEmbed]})
                    success = true;
                    break;

                case "teamcfgSilver":
                    buttonInteraction.deferUpdate()
                    registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                    registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.rank = 1
                    fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                    team = teamBot.findTeamByCoCap(interaction.user.id)
                    interaction.followUp({embeds: [Embeds.RankSuccessEmbed]})
                    success = true;
                    break;

                case "teamcfgBronze":
                    buttonInteraction.deferUpdate()
                    registeredTeams = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
                    registeredTeams.find(pclTeam => {return pclTeam.name === team!.name})!.rank = 2
                    fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams))
                    team = teamBot.findTeamByCoCap(interaction.user.id)
                    interaction.followUp({embeds: [Embeds.RankSuccessEmbed]})
                    success = true;
                    break;


                }
        });

        menuCollector.on("end", async () => {
            if (menuCollector.endReason != "time") return;
            interaction.editReply({ embeds: [Embeds.DisposedInteraction], components: [] });
        });
    }
}
