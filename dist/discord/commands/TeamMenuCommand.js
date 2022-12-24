"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const DiscordCommand_1 = require("../DiscordCommand");
const Embeds = tslib_1.__importStar(require("../embeds/TeamMenuEmbeds"));
const Components = tslib_1.__importStar(require("../components/TeamMenuComponents"));
const fs_1 = tslib_1.__importDefault(require("fs"));
class TeamConfigCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties.setName("team_menu").setDescription("Edit various aspects of your team");
    }
    async executeInteraction(client, interaction, teamBot) {
        let success = false;
        if (!teamBot.findPCLPlayerByDiscord(interaction.user.id))
            return interaction.reply({ embeds: [Embeds.NotRegisteredError] });
        let team = teamBot.findTeamByCoCap(interaction.user.id);
        if (!team)
            return interaction.reply({ embeds: [Embeds.NoTeamError] });
        const reply = await interaction.reply({ components: [new Components.TeamConfigRow(0), Components.AddPlayerButton], embeds: [Embeds.AddPlayerEmbed], ephemeral: true });
        const menuFilter = (i) => {
            if (i.deferred || i.customId != "teamcfgMenu")
                return false;
            i.deferUpdate();
            return i.user == interaction.user;
        };
        const buttonFilter = (i) => {
            if (!i.customId.includes("teamcfg"))
                return false;
            return i.user === interaction.user;
        };
        const menuCollector = reply.createMessageComponentCollector({ filter: menuFilter, componentType: discord_js_1.ComponentType.StringSelect, time: 120_000 });
        const buttonCollector = reply.createMessageComponentCollector({ filter: buttonFilter, componentType: discord_js_1.ComponentType.Button, time: 120_000 });
        menuCollector.on("collect", (menuInteraction) => {
            switch (menuInteraction.values[0]) {
                case "addPlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(0), Components.AddPlayerButton], embeds: [Embeds.AddPlayerEmbed] });
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
                    });
            }
        });
        buttonCollector.on("collect", async (buttonInteraction) => {
            let registeredTeams;
            switch (buttonInteraction.customId) {
                case "teamcfgAdd":
                    await buttonInteraction.showModal(Components.AddPlayerModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 })
                        .then((modalData) => {
                        modalData.deferUpdate();
                        const response = modalData.fields.getTextInputValue("addPlayerText");
                        const pclPlayer = teamBot.findPCLPlayerByOculus(response);
                        if (!pclPlayer)
                            return interaction.editReply({ embeds: [Embeds.PlayerNotFoundError] });
                        registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                        if (registeredTeams.some((PCLTeam) => {
                            return PCLTeam.players.includes(teamBot.findPCLPlayerByOculus(response)?.discordID);
                        }))
                            return interaction.editReply({ embeds: [Embeds.PlayerAlreadyOnError] });
                        registeredTeams.find(PCLTeam => { return PCLTeam.captain === buttonInteraction.user.id; })?.players.push(pclPlayer.discordID);
                        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                        team = teamBot.findTeamByCoCap(interaction.user.id);
                        interaction.editReply({ embeds: [Embeds.AddPlayerSuccess] });
                        success = true;
                    })
                        .catch(() => {
                        return null;
                    });
                    break;
                case "teamcfgRemove":
                    buttonInteraction.showModal(Components.RemovePlayerModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 }).then(modalData => {
                        modalData.deferUpdate();
                        const resposne = modalData.fields.getTextInputValue("removePlayerText");
                        const playerForRemoval = teamBot.findPCLPlayerByOculus(resposne)?.discordID;
                        if (!playerForRemoval)
                            return interaction.editReply({ embeds: [Embeds.PlayerNotFoundError] });
                        if (!team.players.includes(playerForRemoval))
                            return interaction.editReply({ embeds: [Embeds.PlayerNotOnError] });
                        registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                        registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).players = registeredTeams.find(PCLTeam => { return PCLTeam.name === team.name; }).players.filter(player => { return player != playerForRemoval; });
                        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                        team = teamBot.findTeamByCoCap(interaction.user.id);
                        interaction.editReply({ embeds: [Embeds.RemovePlayerSuccess] });
                        success = true;
                    });
                    break;
                case "teamcfgEdit":
                    buttonInteraction.showModal(Components.EditModal);
                    await buttonInteraction.awaitModalSubmit({ time: 120_000 })
                        .then((modalData) => {
                        modalData.deferUpdate();
                        const response = modalData.fields.getTextInputValue("editText");
                        registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                        registeredTeams.find(PCLTeam => { return PCLTeam.name === team.name; }).name = response;
                        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                        team = teamBot.findTeamByCoCap(interaction.user.id);
                        interaction.editReply({ embeds: [Embeds.EditNameSuccess] });
                        success = true;
                    })
                        .catch(() => {
                        return null;
                    });
                    break;
                case "teamcfgTrue":
                    registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                    registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).confidential = true;
                    fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                    team = teamBot.findTeamByCoCap(interaction.user.id);
                    interaction.editReply({ embeds: [Embeds.ConfidentialitySuccess] });
                    success = true;
                    break;
                case "teamcfgFalse":
                    registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                    registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).confidential = false;
                    fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                    team = teamBot.findTeamByCoCap(interaction.user.id);
                    interaction.editReply({ embeds: [Embeds.ConfidentialitySuccess] });
                    success = true;
                    break;
                case "teamcfgGold":
                    registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                    registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).rank = 0;
                    fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                    team = teamBot.findTeamByCoCap(interaction.user.id);
                    interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                    success = true;
                    break;
                case "teamcfgSilver":
                    registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                    registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).rank = 1;
                    fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                    team = teamBot.findTeamByCoCap(interaction.user.id);
                    interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                    success = true;
                    break;
                case "teamcfgBronze":
                    registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
                    registeredTeams.find(pclTeam => { return pclTeam.name === team.name; }).rank = 2;
                    fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
                    team = teamBot.findTeamByCoCap(interaction.user.id);
                    interaction.editReply({ embeds: [Embeds.RankSuccessEmbed] });
                    success = true;
                    break;
            }
        });
        menuCollector.on("end", async () => {
            if (menuCollector.endReason != "time")
                return;
            interaction.editReply({ embeds: [Embeds.DisposedInteraction], components: [] });
        });
    }
}
exports.default = TeamConfigCommand;
//# sourceMappingURL=TeamMenuCommand.js.map