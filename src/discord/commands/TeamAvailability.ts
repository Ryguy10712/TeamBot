import { Client, CommandInteraction, CacheType, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { availability, DayOfWeek, time } from "../../interfaces/PCLTeam";
import { DiscordCommand } from "../DiscordCommand";
import { Team, TeamPlayer, Prisma } from "@prisma/client";

type team =
    | (Team & {
          players: {
              monday: Prisma.JsonValue;
              tuesday: Prisma.JsonValue;
              wednesday: Prisma.JsonValue;
              thursday: Prisma.JsonValue;
              friday: Prisma.JsonValue;
              saturday: Prisma.JsonValue;
              sunday: Prisma.JsonValue;
              playerId: string;
              player: {
                  oculusId: string;
              } | null;
          }[];
      })
    | null;

class TeamAvailabilityEmbed extends EmbedBuilder {
    private teamBot: TeamBot;
    private issuerTeam: team;
    private day: DayOfWeek | undefined;

    constructor(teamBot: TeamBot, issuerTeam: team, day?: DayOfWeek) {
        super();
        this.setColor("DarkButNotBlack");
        this.teamBot = teamBot;
        this.issuerTeam = issuerTeam;
        this.day = day;
    }

    async init() {
        const hourmap = {
            one: "1PM",
            two: "2PM",
            three: "3PM",
            four: "4PM",
            five: "5PM",
            six: "6PM",
            seven: "7PM",
            eight: "8PM",
            nine: "9PM",
            ten: "10PM",
            eleven: "11PM",
            twelve: "12PM",
        };
        //setting the fields
        if (this.day) {
            for (const yes of Object.values(hourmap)) {
                this.addFields({
                    name: yes,
                    value: "...",
                    inline: true,
                });
            }
            this.setTitle(`Availability for ${this.day}`);

            for (const player of this.issuerTeam?.players!) {
                const availability = player[this.day]?.valueOf() as availability;
                if (availability) {
                    for (const obj of Object.entries(availability)) {
                        const time = obj[0] as time;
                        const bool: boolean = obj[1];
                        const fields = this.data.fields!;
                        const field = fields.find((field) => {
                            return field.name == hourmap[time];
                        });
                        if (bool) {
                            field!.value = field!.value.replace("...", "");
                            if (player.player?.oculusId) {
                                field!.value = field!.value.concat(`${player.player.oculusId}\n`);
                            } else {
                                field!.value = field!.value.replace("...", "");
                                const username = (await this.teamBot.client.users.fetch(player.playerId)).username;
                                field!.value = field!.value.concat(`${username}\n`);
                            }
                        }
                    }
                }
            }
        } else {
            this.setTitle("Availability for this week");
            const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
            const hours: time[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
            for (const [i, day] of daysOfWeek.entries()) {
                this.addFields({
                    name: day,
                    value: "...",
                    inline: true,
                });
                const currentField = this.data.fields![i];
                hourLoop: for (const hour of hours) {
                    let count = 0;
                    for (const player of this.issuerTeam!.players) {
                        const avail = player[day]?.valueOf() as availability;
                        if (avail) {
                            if (avail[hour]) {
                                count++;
                                if (count >= 5) {
                                    currentField.value = currentField.value.replace("...", "");
                                    currentField.value += `${hourmap[hour]}🟢`;
                                    break hourLoop;
                                }
                            }
                        }
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
        const dayResponse = interaction.options.get("day")?.value;
        const issuerTeam = await teamBot.prisma.team.findFirst({
            where: { players: { some: { playerId: interaction.user.id } } },
            include: {
                players: {
                    select: {
                        playerId: true,
                        player: { select: { oculusId: true } },
                        monday: true,
                        tuesday: true,
                        wednesday: true,
                        thursday: true,
                        saturday: true,
                        sunday: true,
                        friday: true,
                    },
                },
            },
        });

        if (!issuerTeam) return interaction.reply({ content: "you are not on a team", ephemeral: true });
        if (!issuerTeam.schedulingChannel) {
            interaction.reply({ content: "your team does not have a scheduling channel", ephemeral: true });
            return;
        }
        if (dayResponse) {
            const embed = new TeamAvailabilityEmbed(teamBot, issuerTeam, dayResponse as DayOfWeek);
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
