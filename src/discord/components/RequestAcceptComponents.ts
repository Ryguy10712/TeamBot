import { TeamPlayer } from "@prisma/client";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { TeamBot } from "../../Bot";
import { MatchType, DayOfWeek, time, availability } from "../../typings";
import { MatchOrganizerUpdateButton } from "../buttons/OrganizerUpdate";

type team = {
    players: TeamPlayer[];
    name: string;
};

export class MatchOrganizerEmbed extends EmbedBuilder {
    constructor(team: team, opponent: team, type: MatchType) {
        super();
        this.setColor("DarkButNotBlack");

        this.setTitle(`${MatchType[type]} vs ${opponent.name}`);
        this.data.fields = [
            {
                name: "Tuesday",
                value: "...",
                inline: true,
            },
            {
                name: "Wednesday",
                value: "...",
                inline: true,
            },
            {
                name: "Thursday",
                value: "...",
                inline: true,
            },
            {
                name: "Friday",
                value: "...",
                inline: true,
            },
            {
                name: "Saturday",
                value: "...",
                inline: true,
            },
            {
                name: "Sunday",
                value: "...",
                inline: true,
            },
            {
                name: "Monday",
                value: "...",
                inline: true,
            },
        ];

        //fuck intellisense type checking
        const hours: time[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
        const daysOfWeek: DayOfWeek[] = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];
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

        for (const [i, day] of daysOfWeek.entries()) {
            const currentField = this.data.fields[i];
            for (const hour of hours) {
                const readyPlayers = team.players.filter((player) => {
                    const avail = player[day]?.valueOf() as availability;
                    if (!avail) return false;
                    return avail[hour] == true;
                });
                const readyOppPlayers = opponent.players.filter((player) => {
                    const avail = player[day]?.valueOf() as availability;
                    if (!avail) return false;
                    return avail[hour] == true;
                });

                if (readyPlayers.length >= 5 && readyOppPlayers.length >= 5) {
                    currentField.value = currentField.value.replace("...", "");
                    currentField.value += `${hourmap[hour]}🟢\n`;
                    break;
                }
            }
        }
    }
}

export class UpdateButton extends ButtonBuilder {
    constructor(scheduleRequestId: number) {
        super();
        this.setStyle(ButtonStyle.Primary);
        this.setLabel("Update");
        this.setCustomId(`matchOrganizerUpdate${scheduleRequestId}`);
    }
}

export class UpdateButtonRow extends ActionRowBuilder<MatchOrganizerUpdateButton> {
    constructor(scheduleRequestId: number, teamBot: TeamBot) {
        super();
        const btn = new MatchOrganizerUpdateButton(scheduleRequestId, teamBot.prisma);
        this.addComponents(btn);
        teamBot.initButton(btn);
    }
}

export class RequesterChanDeleted extends EmbedBuilder {
    constructor() {
        super();
        this.setColor("Red");
        this.setTitle("Bruh");
        this.setFields({
            name: "Failed:",
            value: "The requesting team has deleted their scheduling channel.",
        });
        this.setFooter({ text: "The schedule request has been terminated" });
    }
}

export class AccepterChanDeleted extends EmbedBuilder {
    constructor() {
        super();
        this.setColor("Red");
        this.setTitle("Bruh");
        this.setFields({
            name: "Failed",
            value: "You have deleted your set scheduling channel",
        });
        this.setFooter({ text: "The schedule request has been terminated" });
    }
}
