import { EmbedBuilder } from "discord.js";

export class MatchResultsEmbed extends EmbedBuilder {
    constructor(expected: number, actual: number, eloChange: number, points: number){
        super()
        this.setColor("Blue")
        this.setTitle("Results:")
        this.addFields(
            {
                name: "Expected win rate:",
                value: expected.toString(),
                inline: true
            },
            {
                name: "Actual win rate:",
                value: actual.toString(),
                inline: true,
            },
            {
                name: "Elo change:",
                value: eloChange.toString(),
                inline: false,
            },
            {
                name: "Points awarded:",
                value: points.toString(),
                inline: true
            }
        )
    }
}