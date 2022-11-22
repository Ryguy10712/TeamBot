"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const PCLTeam_1 = require("../../interfaces/PCLTeam");
const fs_1 = tslib_1.__importDefault(require("fs"));
const DiscordCommand_1 = require("../DiscordCommand");
const RegisterTeamEmbeds = tslib_1.__importStar(require("../embeds/RegisterTeamEmbeds"));
class RegisterTeamCommand extends DiscordCommand_1.DiscordCommand {
    inDev = false;
    constructor() {
        super();
        this.properties
            .setName("register_team")
            .setDescription("adds your team to the database")
            .addStringOption(new discord_js_1.SlashCommandStringOption().setName("team_name").setDescription("the name of your team").setRequired(true))
            .addBooleanOption(new discord_js_1.SlashCommandBooleanOption().setName("confidential").setDescription("is this team visible to others?").setRequired(true))
            .addMentionableOption(new discord_js_1.SlashCommandMentionableOption().setName("cocap_discord").setDescription("the co-captain of your team"))
            .addStringOption(new discord_js_1.SlashCommandStringOption().setName("cocap_oculus").setDescription("use co_cap discord if you can"))
            .addStringOption(new discord_js_1.SlashCommandStringOption()
            .setName("rank")
            .setDescription("leave blank if you are unranked")
            .setChoices({ name: "Gold", value: "Gold" }, { name: "Silver", value: "Silver" }, { name: "Bronze", value: "Bronze" }));
        this.actionRows.push(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("YES").setCustomId("0yes").setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setLabel("NO").setCustomId("0no").setStyle(discord_js_1.ButtonStyle.Danger)));
    }
    async executeInteraction(client, interaction, teamBot) {
        const discordResponse = interaction.options.get("cocap_discord")?.value;
        const stringResponse = interaction.options.get("cocap_oculus")?.value;
        const teamName = interaction.options.get("team_name")?.value;
        const confidentiality = interaction.options.get("confidential")?.value;
        const player = teamBot.findPCLPlayerByDiscord(interaction.user.id);
        const registeredTeams = JSON.parse(fs_1.default.readFileSync("./db/teams.json", "utf-8"));
        let cocap;
        if (!player)
            return interaction.reply({ embeds: [RegisterTeamEmbeds.NotRegisteredError] });
        if (registeredTeams.some((PCLTeam) => {
            return PCLTeam.name.toLowerCase() == teamName.toLowerCase();
        }))
            return interaction.reply({ embeds: [RegisterTeamEmbeds.TeamNameMatchError] });
        if (discordResponse) {
            cocap = teamBot.findPCLPlayerByDiscord(discordResponse);
        }
        else if (stringResponse) {
            cocap = teamBot.findPCLPlayerByOculus(stringResponse);
        }
        if (cocap === undefined) {
            if (discordResponse)
                return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapNotRegisteredError] });
            if (stringResponse)
                return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapNotRegisteredError] });
        }
        let team = {
            captain: player.discordID,
            coCap: undefined,
            players: [player.discordID],
            rank: undefined,
            guildID: undefined,
            isWeeklySchedulingPollsEnabled: undefined,
            confidential: confidentiality,
            name: teamName,
        };
        if (cocap) {
            team.players.push(cocap.discordID);
            team.coCap = cocap.discordID;
        }
        switch (interaction.options.get("rank")?.value) {
            case "Gold":
                team.rank = PCLTeam_1.Ranks.GOLD;
                break;
            case "Silver":
                team.rank = PCLTeam_1.Ranks.SILVER;
                break;
            case "Bronze":
                team.rank = PCLTeam_1.Ranks.BRONZE;
        }
        if (registeredTeams.some((PCLTeam) => {
            return PCLTeam.captain == player.discordID || PCLTeam.coCap == player.discordID;
        }))
            return interaction.reply({ embeds: [RegisterTeamEmbeds.AlreadyCaptainError] });
        if (team.coCap != undefined) {
            if (registeredTeams.some((PCLTeam) => {
                return PCLTeam.captain == team.coCap || PCLTeam.coCap == team.coCap;
            }))
                return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapOccuipiedError] });
            if (interaction.user.id === team.coCap)
                return interaction.reply({ embeds: [RegisterTeamEmbeds.CaptainCoCapMatchError] });
        }
        registeredTeams.push(team);
        fs_1.default.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
        RegisterTeamEmbeds.TeamCreateSuccess.setFields({
            name: "Success:",
            value: `Team **${teamName}** has been created with the following: \n **Co-Captain:** <@${team.coCap}> \n **Rank:** ${interaction.options.get("rank")?.value}`,
        });
        await interaction.reply({ embeds: [RegisterTeamEmbeds.TeamCreateSuccess] });
    }
}
exports.default = RegisterTeamCommand;
//# sourceMappingURL=RegisterTeamCommand.js.map