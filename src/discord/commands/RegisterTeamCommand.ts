import {
    Client,
    CommandInteraction,
    CacheType,
    SlashCommandMentionableOption,
    SlashCommandStringOption,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonInteraction,
    ComponentType,
    ButtonComponent,
    AnyComponentBuilder,
    SlashCommandBooleanOption,
} from "discord.js";
import { PCLTeam, Ranks } from "../../interfaces/PCLTeam";
import PCLPlayer from "../../interfaces/PCLPlayer";
import fs from "fs";
import { DiscordCommand } from "../DiscordCommand";
import { TeamBot } from "../../Bot";
import * as RegisterTeamEmbeds from "../embeds/RegisterTeamEmbeds";
import { register } from "ts-node";

export default class RegisterTeamCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties
            .setName("register_team")
            .setDescription("adds your team to the database")
            .addStringOption(new SlashCommandStringOption().setName("team_name").setDescription("the name of your team").setRequired(true))
            .addBooleanOption(new SlashCommandBooleanOption().setName("confidential").setDescription("is this team visible to others?").setRequired(true))
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
        const player = teamBot.findPCLPlayerByDiscord(interaction.user.id);
        const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        let captainOnTeamFlag: boolean;
        let coCaptainOnTeamFlag: boolean;
        let cocap: PCLPlayer;

        //terminate if user isn't registered
        if (!player) return interaction.reply({ embeds: [RegisterTeamEmbeds.NotRegisteredError] });

        //terminate if a team shares the same name
        if (
            registeredTeams.some((PCLTeam) => {
                return PCLTeam.name.toLowerCase() == teamName.toLowerCase();
            })
        )
            return interaction.reply({ embeds: [RegisterTeamEmbeds.TeamNameMatchError] });

        if (discordResponse) {
            cocap = teamBot.findPCLPlayerByDiscord(discordResponse)!;
        } else if (stringResponse) {
            cocap = teamBot.findPCLPlayerByOculus(stringResponse)!;
        }
        //terminate if cocap isnt found, and user has provided one
        if (cocap! === undefined) {
            if (discordResponse) return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapNotRegisteredError] });
            if (stringResponse) return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapNotRegisteredError] });
        }
        let team: PCLTeam = {
            captain: player.discordID,
            coCap: undefined,
            players: [player.discordID],
            rank: undefined,
            guildID: undefined,
            isWeeklySchedulingPollsEnabled: undefined,
            confidential: confidentiality,
            name: teamName,
        };
        if (cocap!) {
            team.players.push(cocap.discordID);
            team.coCap = cocap.discordID;
        }
        //determine team rank
        switch (interaction.options.get("rank")?.value) {
            case "Gold":
                team.rank = Ranks.GOLD;
                break;
            case "Silver":
                team.rank = Ranks.SILVER;
                break;
            case "Bronze":
                team.rank = Ranks.BRONZE;
        }
        /*determine team guild NOT NEEDED ATM
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("yes").setStyle(ButtonStyle.Success).setLabel("Yes"),
            new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger)
        );
        const msg = await interaction.reply({
            components: [this.actionRows[0] as ActionRowBuilder<ButtonBuilder>],
            embeds: [RegisterTeamEmbeds.GuildConfirmationEmbed],
        });
        const filter: any = (i: ButtonInteraction) => {
            i.deferUpdate();
            return i.user.id == interaction.user.id;
        };
        let collected = await msg.awaitMessageComponent({ filter: filter, componentType: ComponentType.Button, time: 60000 }).catch();

        //terminate if this is not the teams guild
        if (collected.customId === "0no") return interaction.followUp({ embeds: [RegisterTeamEmbeds.NotTeamGuildError] });
        team.guildID = interaction.guild?.id;
        */
        //return if the player is a captain
        if (
            registeredTeams.some((PCLTeam) => {
                return PCLTeam.captain == player.discordID || PCLTeam.coCap == player.discordID;
            })
        )
            return interaction.reply({ embeds: [RegisterTeamEmbeds.AlreadyCaptainError] });

        if (
            registeredTeams.some((PCLTeam) => {
                return PCLTeam.captain == team.coCap || PCLTeam.coCap == team.coCap;
            })
        )
            return interaction.reply({ embeds: [RegisterTeamEmbeds.CoCapOccuipiedError] });
        //then push the team to registeredTeams
        registeredTeams.push(team);
        fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
        RegisterTeamEmbeds.TeamCreateSuccess.setFields({
            name: "Success:",
            value: `Team **${teamName}** has been created with the following: \n **Co-Captain:** <@${team.coCap}> \n **Rank:** ${
                interaction.options.get("rank")?.value
            }`,
        });
        await interaction.reply({ embeds: [RegisterTeamEmbeds.TeamCreateSuccess] });
    }
}
