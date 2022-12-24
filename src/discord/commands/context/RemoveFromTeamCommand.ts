import { Client, CommandInteraction, CacheType, ContextMenuCommandInteraction, ApplicationCommandType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { PCLTeam } from "../../../interfaces/PCLTeam";
import { DiscordContextMenu } from "../../DiscordContextMenu";
import { PlayerNotOnUserTeamEmbed, UserNotCaptainEmbed, UserNotOnTeamEmbed } from "../../embeds/CommonEmbeds";
import fs from "fs";
import { PlayerRemoveSuccess } from "../../embeds/AddToTeamEmbeds";

export class RemoveFromTeamCommand extends DiscordContextMenu {
    public inDev: boolean;

    constructor() {
        super();
        this.inDev = false;
        this.properties.setName("Remove from team").setType(ApplicationCommandType.User);
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
        if (!issuerTeam.players.includes(interaction.targetId)) {
            interaction.reply({ embeds: [new PlayerNotOnUserTeamEmbed()], ephemeral: true });
            return;
        }

        issuerTeam.players.splice(issuerTeam.players.indexOf(interaction.targetId), 1);
        if(issuerTeam.coCap == interaction.targetId){
            issuerTeam.coCap = undefined;
        } 
        fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb))
        interaction.reply({embeds: [new PlayerRemoveSuccess], ephemeral: true})
    }
}
