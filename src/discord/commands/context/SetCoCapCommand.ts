import { Client, ContextMenuCommandInteraction, CacheType, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordContextMenu } from "../../DiscordContextMenu";
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
        const issuer = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.user.id}
        })

        if (!issuer) return interaction.reply({ embeds: [new UserNotOnTeamEmbed()], ephemeral: true }); //not on team
        if (!issuer.isCaptain && !issuer.isCoCap) {
            interaction.reply({ embeds: [new UserNotCaptainEmbed()], ephemeral: true });
            return;
        }
        const candidate = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.targetId}
        })
        if(candidate?.playerId == issuer.playerId){
            interaction.reply({content: "You cannot be captain and co captain at the same time", ephemeral: true})
            return;
        }
        if (candidate?.teamId != issuer.teamId) {
            interaction.reply({ embeds: [new PlayerNotOnUserTeamEmbed()], ephemeral: true });
            return;
        }



       teamBot.prisma.teamPlayer.update({
        where: {playerId: interaction.targetId},
        data: {isCoCap: true}
       })
       .then(() => {
        teamBot.prisma.$disconnect()
        interaction.reply({embeds: [new CoCapSetEmbed()], ephemeral: true})
       })
       .catch(() => {
        teamBot.prisma.$disconnect()
        interaction.reply("An unexpected error occured")
       })

    }
    
}