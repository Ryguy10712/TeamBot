import { Client, CommandInteraction, CacheType, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { availability, DayOfWeek, PCLTeam, time } from "../../interfaces/PCLTeam";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import { Team, TeamPlayer } from "@prisma/client";

class TeamAvailabilityEmbed extends EmbedBuilder {
    private teamBot: TeamBot;
    private team: (Team & {
        players: (TeamPlayer & {
            player: {
                oculusId: string;
            } | null;
        })[];
    }) | null
    private day: DayOfWeek | undefined;

    constructor(teamBot: TeamBot, team: (Team & {
        players: (TeamPlayer & {
            player: {
                oculusId: string;
            } | null;
        })[];
    }) | null, day?: DayOfWeek) {
        super();
        this.setColor("DarkButNotBlack");
        this.teamBot = teamBot;
        this.team = team
        this.day = day;
    }

    async init() {
        const hourmap = {
            "one": "1PM",
            "two": "2PM",
            "three": "3PM",
            "four": "4PM",
            "five": "5PM",
            "six": "6PM",
            "seven": "7PM",
            "eight": "8PM",
            "nine": "9PM",
            "ten": "10PM",
            "eleven": "11PM",
            "twelve": "12PM"
        }
        //setting the fields
        if (this.day) {
            for(const yes of Object.values(hourmap)){
                this.addFields({
                    name: yes,
                    value: "...",
                    inline: true
                })
            }
            this.setTitle(`Availability for ${this.day}`);

            for (const player of this.team?.players!) {
                const availability = player[this.day]?.valueOf() as availability
                if(!availability) break;
                for(const obj of Object.entries(availability)){
                    const time = obj[0] as time
                    const bool: boolean = obj[1]
                    const fields = this.data.fields!
                    const field = fields.find(field => {
                        return field.name == hourmap[time]
                    })
                    if(bool){
                        
                        field!.value = field!.value.replace("...", "")
                        if(player.player?.oculusId){
                            field!.value = field!.value.concat(`${player.player.oculusId}\n`)
                        } else {
                            field!.value = field!.value.replace("...", "")
                            const username = (await this.teamBot.client.users.fetch(player.playerId)).username
                            field!.value = field!.value.concat(`${username}\n`)
                        }
                    }
                }
                
            }
        } else {
            this.setTitle("Availability for this week");
            const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
            const hours: time[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
            for(const day of daysOfWeek) {
                this.addFields({
                    name: day,
                    value: "...",
                    inline: true
                })
                const currentField = this.data.fields?.find(field => {
                    return field.name === day
                })
                for(const player of this.team!.players){
                    const avail = player[day]?.valueOf() as availability
                    if(!avail) break;
                    for(const hour of hours){
                        let count = 0
                        if(avail[hour] == true){
                            count ++
                            if(count >= 1){
                                currentField!.value = currentField!.value.replace("...", "")
                                currentField!.value += `${hourmap[hour]}🟢\n`
                                break;
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
        const dayResponse = interaction.options.get("day");
        const issuerTeam = await teamBot.prisma.team.findFirst({
            where: {players: {some: {playerId: interaction.user.id}}},
            include: {players: {include: {player: {select: {oculusId: true}}}}}
        })

        if (!issuerTeam) return interaction.reply({ content: "you are not on a team", ephemeral: true });
        if(!issuerTeam.schedulingChannel){
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
