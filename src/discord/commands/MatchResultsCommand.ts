import { Client, CommandInteraction, CacheType, SlashCommandIntegerOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import { MatchResultsEmbed } from "../embeds/MatchResultsEmbeds";

export class MatchResultsCommand extends DiscordCommand {
    public inDev: boolean;

    constructor(){
        super()
        this.inDev = false;
        this.properties.setName("match_results")
        .setDescription("tells you elo and LP gains/loss from match data")
        
        const issuerEloOption = new SlashCommandIntegerOption()
        .setName("your_elo")
        .setDescription("your team's elo before the match")
        .setMinValue(0)
        .setRequired(true)

        const opponentEloOption = new SlashCommandIntegerOption()
        .setName("enemy_elo")
        .setDescription("your opponent's elo before the match")
        .setMinValue(0)
        .setRequired(true)

        const roundsWonOption = new SlashCommandIntegerOption()
        .setName("rounds_won")
        .setDescription("how many rounds your team won during the match")
        .setMinValue(0)
        .setMaxValue(29)
        .setRequired(true)

        const roundsLostOption = new SlashCommandIntegerOption()
        .setName("rounds_lost")
        .setDescription("how many rounds your team lost during the match")
        .setMinValue(0)
        .setMaxValue(28)
        .setRequired(true)

        this.properties
        .addIntegerOption(issuerEloOption)
        .addIntegerOption(opponentEloOption)
        .addIntegerOption(roundsWonOption)
        .addIntegerOption(roundsLostOption)
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const issuerElo = interaction.options.get("your_elo", true).value as number
        const opponentElo = interaction.options.get("enemy_elo", true).value as number
        const roundsWon = interaction.options.get("rounds_won", true).value as number
        const roundsLost = interaction.options.get("rounds_lost", true).value as number

        let actualWinPrcnt = roundsWon/(roundsWon + roundsLost)
        
        const [HigherTeamELO, LowerteamELO] = [issuerElo, opponentElo].sort((a, b) => b - a)
        let expectedWinPrcnt = (1 / (1 + Math.pow(10, (HigherTeamELO - LowerteamELO) / 920)))

        const isIssuerHigherElo: boolean = expectedWinPrcnt != 0.5 && issuerElo > opponentElo ? true : false
        if(isIssuerHigherElo){
            expectedWinPrcnt = 1.00 - expectedWinPrcnt
        }

        let ratingChange = 290 * (actualWinPrcnt - expectedWinPrcnt)
        console.log(expectedWinPrcnt)
        console.log(actualWinPrcnt)

        let leaguePoints = actualWinPrcnt * (1.0 + actualWinPrcnt - expectedWinPrcnt) * 6.5
        if(roundsWon > roundsLost){
            leaguePoints += 4
        }

        //cleanup
        actualWinPrcnt *= 100
        actualWinPrcnt = Math.round(actualWinPrcnt * 10) / 10
        expectedWinPrcnt *= 100
        expectedWinPrcnt = Math.round(expectedWinPrcnt * 10) / 10
        ratingChange = Math.round(ratingChange)
        leaguePoints = Math.round(leaguePoints)



        interaction.reply({embeds: [new MatchResultsEmbed(expectedWinPrcnt, actualWinPrcnt, ratingChange, leaguePoints)], ephemeral: true})
        

    }
}