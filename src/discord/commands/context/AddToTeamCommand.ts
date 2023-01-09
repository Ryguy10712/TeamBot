import { Client, CacheType, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordContextMenu } from "../../DiscordContextMenu";
import fs from "fs";
import { PCLTeam } from "../../../interfaces/PCLTeam";
import { PlayerAlreadyOnEmbed, UserNotCaptainEmbed, UserNotOnTeamEmbed } from "../../embeds/CommonEmbeds";
import { PlayerAddSuccess } from "../../embeds/AddToTeamEmbeds";

export class AddToTeamCommand extends DiscordContextMenu {
    public inDev: boolean;

    constructor() {
        super();
        this.inDev = false;
        this.properties = new ContextMenuCommandBuilder().setName("Add to team").setType(ApplicationCommandType.User);
    }
    async executeInteraction(client: Client<boolean>, interaction: ContextMenuCommandInteraction<CacheType>, teamBot: TeamBot) {
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        const issuerTeam = teamsDb.find((pclTeam) => {
            return pclTeam.players.includes(interaction.user.id);
        });

        if (!issuerTeam) return interaction.reply({ embeds: [new UserNotOnTeamEmbed()], ephemeral: true }); //not on team
        if (issuerTeam.captain != interaction.user.id && issuerTeam.coCap != interaction.user.id) {
            interaction.reply({ embeds: [new UserNotCaptainEmbed()], ephemeral: true });
            return;
        }
        if(teamsDb.find(pclTeam => {return pclTeam.players.includes(interaction.targetId)})){
            return interaction.reply({embeds: [new PlayerAlreadyOnEmbed], ephemeral: true})
        }

        issuerTeam.players.push(interaction.targetId)
        fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb))
        interaction.reply({embeds: [new PlayerAddSuccess], ephemeral: true})
        
    }
}
