import { Client, CommandInteraction, CacheType, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { DayOfWeek, PCLTeam } from "../../interfaces/PCLTeam";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";

class TeamAvailabilityEmbed extends EmbedBuilder {
    private teamBot: TeamBot;
    private team: PCLTeam;
    private day: DayOfWeek | undefined;

    constructor(teamBot: TeamBot, team: PCLTeam, day?: DayOfWeek) {
        super();
        this.setColor("DarkButNotBlack");
        this.teamBot = teamBot;
        this.team = team;
        this.day = day;
    }

    async init() {
        //setting the fields
        if (this.day) {
            this.setTitle(`Availability for ${this.day}`);
            const entries = Object.entries(this.team.availability![this.day]);

            for (const entry of entries) {
                const fieldName = entry[1].length >= 5 ? `${entry[0]}✅` : entry[0].toString();

                let fieldValue: string = "";

                for (const discordId of entry[1]) {
                    const oculusId = this.teamBot.findPCLPlayerByDiscord(discordId)?.oculusId;
                    if (!oculusId) {
                        //fetch discord username
                        const discordUser = await this.teamBot.client.users.fetch(discordId);
                        fieldValue += `${discordUser.username} (Discord)\n`;
                    } else {
                        fieldValue += `${oculusId}\n`;
                    }
                }
                if (entry[1].length == 0) {
                    fieldValue = "...";
                }
                this.addFields({
                    name: fieldName,
                    value: fieldValue,
                    inline: true,
                });
            }
        } else {
            this.setTitle("Availability for this week");
            const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];

            for (const day of daysOfWeek) {
                let fieldValue: string = "";
                const entries = Object.entries(this.team.availability![day]);
                for (const entry of entries) {
                    if (entry[1].length >= 5) {
                        fieldValue += `${entry[0]} ✅`;
                        this.addFields({
                            name: day,
                            value: fieldValue,
                            inline: true
                        })
                    }
                }
            }
        }
    }
}

export class TeamAvailabilityCommand extends DiscordCommand {
    public inDev: boolean;

    constructor() {
        super();
        this.inDev = false;
        this.properties
            .setName("team_availability")
            .setDescription("shows your team's availability in a single message")
            .addStringOption(
                new SlashCommandStringOption()
                    .setChoices(
                        {
                            name: "Tuesday",
                            value: "tuesday",
                        },
                        {
                            name: "Wednesday",
                            value: "wednesday",
                        },
                        {
                            name: "Thursday",
                            value: "thursday",
                        },
                        {
                            name: "Friday",
                            value: "friday",
                        },
                        {
                            name: "Saturday",
                            value: "saturday",
                        },
                        {
                            name: "Sunday",
                            value: "sunday",
                        },
                        {
                            name: "Monday",
                            value: "monday",
                        }
                    )
                    .setName("day")
                    .setDescription("specifying the day will show more detailed availability")
                    .setRequired(false)
            );
    }
    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const dayResponse = interaction.options.get("day");
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.players.includes(interaction.user.id);
        });

        if (!issuerTeam) return interaction.reply({ content: "you are not on a team", ephemeral: true });
        if(!issuerTeam.availability){
            interaction.reply({content: "your team does not have a scheduling channel", ephemeral: true})
            return;
        }
        if (dayResponse) {
            const embed = new TeamAvailabilityEmbed(teamBot, issuerTeam, dayResponse.value as DayOfWeek);
            await embed.init();
            interaction.reply({ ephemeral: true, embeds: [embed] });
        } else {
            //did not provide day
            const embed = new TeamAvailabilityEmbed(teamBot, issuerTeam);
            await embed.init();
            interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    }
}
