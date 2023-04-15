import { AutocompleteInteraction, CacheType, Client, CommandInteraction, SlashCommandStringOption } from "discord.js";
import { DiscordCommand } from "../DiscordCommand"
import { TeamBot } from "../../Bot";
import { UserNotCaptainOrEmbed } from "../embeds/CommonEmbeds";

export class RemovePlayerCommand extends DiscordCommand {
    public inDev: boolean
    constructor(){
        super()
        this.inDev = true;
        this.properties
        .setName("remove_player")
        .setDescription("generates a list of players to remove")
        
        const playerOption = new SlashCommandStringOption()
        .setName("player")
        .setDescription("the player to remove from the team")
        .setAutocomplete(true)
        .setRequired(true)

        this.properties.addStringOption(playerOption);
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const cmdIssuer = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.user.id},
            include: {team: true}
        })
        const removedPlayer = interaction.options.get("player", true).value as string;

        if(isNaN(parseInt(removedPlayer))){
            interaction.reply({content: "Please select a player from the list", ephemeral: true})
            return;
        }

        if(!cmdIssuer?.isCaptain && !cmdIssuer?.isCoCap){
            interaction.reply({embeds: [new UserNotCaptainOrEmbed], ephemeral: true})
            return;
        }

        teamBot.prisma.teamPlayer.delete({
            where: {playerId: removedPlayer}
        })
        .then(() => {teamBot.prisma.$disconnect()})

        interaction.reply({content: "Success", ephemeral: true})

        
        
    }

    override async handleAutoComplete(i: AutocompleteInteraction<CacheType>, teamBot: TeamBot): Promise<boolean> {
        const players = await teamBot.prisma.teamPlayer.findMany({where: {team: {players: {some: {playerId: i.user.id}}}}, include: {player: true}})
        const filteredPlayers = players.filter((player) => {
            if(player.isCaptain || player.isCoCap){
                return false
            } else {
                return true
            }
        })
        const playerMap = filteredPlayers.map(async (teamPlayer) => {

            if(teamPlayer.player){
                return {name: teamPlayer.player.oculusId, value: teamPlayer.playerId}
            } else {
                const discordUser = await teamBot.client.users.fetch(teamPlayer.playerId)
                return {name: discordUser.username, value: teamPlayer.playerId}
            }
        })
        const formattedPlayers = await Promise.all(playerMap)
        i.respond(formattedPlayers)
        return true

    }
}