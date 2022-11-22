import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../Bot";
import fs from "fs"
import { DiscordCommand } from "../DiscordCommand";
import { PCLTeam } from "../../interfaces/PCLTeam";
import * as Embeds from "../embeds/DeleteTeamEmbeds"

export default class DeleteTeamCommand extends DiscordCommand {
    public inDev: boolean = false;

	constructor(){
		super()
		this.properties
			.setName("delete_team")
			.setDescription("deletes your team... forever")
	}
    executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
		const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
		const team = registeredTeams.find(pclTeam => pclTeam.captain === interaction.user.id);
		if(!team) return interaction.reply({embeds: [Embeds.NotCaptainError]});
		registeredTeams.splice(registeredTeams.indexOf(team), 1);
		fs.writeFileSync("./db/teams.json", JSON.stringify(registeredTeams));
		interaction.reply({embeds: [Embeds.Success]})

	}
}
