import { Client, CacheType, ContextMenuCommandInteraction, ApplicationCommandType } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordContextMenu } from "../../DiscordContextMenu";
import { PlayerNotOnUserTeamEmbed, UserNotCaptainOrEmbed, UserNotOnTeamEmbed } from "../../embeds/CommonEmbeds";
import { PlayerRemoveSuccess } from "../../embeds/AddToTeamEmbeds";

export class RemoveFromTeamCommand extends DiscordContextMenu {
    public inDev: boolean;

    constructor() {
        super();
        this.inDev = false;
        this.properties.setName("Remove from team").setType(ApplicationCommandType.User);
    }
    async executeInteraction(client: Client<boolean>, interaction: ContextMenuCommandInteraction<CacheType>, teamBot: TeamBot) {
        const issuer = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.user.id}
        })

        if (!issuer) return interaction.reply({ embeds: [new UserNotOnTeamEmbed()], ephemeral: true }); //not on team
        if (!issuer.isCaptain && !issuer.isCoCap) {
            interaction.reply({ embeds: [new UserNotCaptainOrEmbed()], ephemeral: true });
            return;
        }
        const candidate = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.targetId}
        })
        if (candidate?.teamId != issuer.teamId) {
            interaction.reply({ embeds: [new PlayerNotOnUserTeamEmbed()], ephemeral: true });
            return;
        }

       teamBot.prisma.teamPlayer.delete({
        where: {playerId: interaction.targetId}
       })
       .then(() => {
        teamBot.prisma.$disconnect()
        interaction.reply({embeds: [new PlayerRemoveSuccess], ephemeral: true})
       })
       .catch(() => {
        teamBot.prisma.$disconnect()
        interaction.reply("An unexpected error occured")
       })
    }
}
