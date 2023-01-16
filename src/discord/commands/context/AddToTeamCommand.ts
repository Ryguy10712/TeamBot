import { Client, CacheType, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction } from "discord.js";
import { TeamBot } from "../../../Bot";
import { DiscordContextMenu } from "../../DiscordContextMenu";
import { PlayerAlreadyOnEmbed, UserNotCaptainOrEmbed, UserNotOnTeamEmbed } from "../../embeds/CommonEmbeds";
import { PlayerAddSuccess } from "../../embeds/AddToTeamEmbeds";

export class AddToTeamCommand extends DiscordContextMenu {
    public inDev: boolean;

    constructor() {
        super();
        this.inDev = false;
        this.properties = new ContextMenuCommandBuilder().setName("Add to team").setType(ApplicationCommandType.User);
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
        if(candidate){
            interaction.reply({embeds: [new PlayerAlreadyOnEmbed()], ephemeral: true})
            return;
        }
        
        teamBot.prisma.team.update({
            where: {id: issuer.teamId},
            data: {
                players: {
                    create: {playerId: interaction.targetId}
                }
            }
        })
        .then(() => {
            teamBot.prisma.$disconnect()
            interaction.reply({embeds: [new PlayerAddSuccess], ephemeral: true})
        })
        .catch(() => {
            teamBot.prisma.$disconnect()
            interaction.reply("An unexpected error occured")
        })

        
        
        
    }
}
