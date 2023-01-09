import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import * as Embeds from "../embeds/DeleteTeamEmbeds";

export default class DeleteTeamCommand extends DiscordCommand {
    public inDev: boolean = false;

	constructor(){
		super()
		this.properties
			.setName("delete_team")
			.setDescription("deletes your team... forever")
	}
    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
		const teamToPlayer = await teamBot.prisma.teamPlayer.findFirst({
			where: {
				isCaptain: true,
				playerId: interaction.user.id
			},
		})
		if(!teamToPlayer){
			interaction.reply({embeds: [Embeds.NotCaptainError], ephemeral: true})
			return;
		}

		teamBot.prisma.team.delete({
			where: {id: teamToPlayer.teamId}
		}).then(() => {
			interaction.reply({embeds: [Embeds.Success], ephemeral: true})
			teamBot.prisma.$disconnect()
		}).catch(() => {
			interaction.reply("An unexpected error has occured")
			teamBot.prisma.$disconnect()
		})

	}
}
