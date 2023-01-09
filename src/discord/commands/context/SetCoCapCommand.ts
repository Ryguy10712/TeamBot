import { Client, ContextMenuCommandInteraction, CacheType, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordContextMenu } from "../../DiscordContextMenu";
import fs from "fs";
import { PCLTeam } from "../../../interfaces/PCLTeam";
import { PlayerNotOnUserTeamEmbed, UserNotCaptainEmbed, UserNotOnTeamEmbed } from "../../embeds/CommonEmbeds";
import { CoCapSetEmbed } from "../../embeds/SetCoCapEmbeds";

export class SetCoCapCommand extends DiscordContextMenu {
    public inDev: boolean;

    constructor(){
        super()
        this.inDev = false;
        this.properties = new ContextMenuCommandBuilder()
            .setType(ApplicationCommandType.User).setName("Set as co-captain")
    }
    async executeInteraction(client: Client<boolean>, interaction: ContextMenuCommandInteraction<CacheType>, teamBot: TeamBot) {
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
        const issuerTeam = teamsDb.find(pclTeam => {
            return pclTeam.captain == interaction.user.id || pclTeam.coCap == interaction.user.id;
        })

        if(!issuerTeam) return interaction.reply({embeds: [new UserNotOnTeamEmbed()], ephemeral: true})
        if(issuerTeam.captain != interaction.user.id && issuerTeam.coCap != interaction.user.id){
            interaction.reply({embeds: [new UserNotCaptainEmbed()], ephemeral: true});
            return;
        }
        if(!issuerTeam.players.includes(interaction.targetId)){
            interaction.reply({embeds: [new PlayerNotOnUserTeamEmbed()], ephemeral: true});
            return;
        }
        //all is good at this point
        issuerTeam.coCap = interaction.targetId
        fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb))
        interaction.reply({embeds: [new CoCapSetEmbed], ephemeral: true})

    }
    
}