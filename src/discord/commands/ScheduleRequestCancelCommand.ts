import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import { UserNotCaptainOrEmbed } from "../embeds/CommonEmbeds";

export class ScheduleRequestCancelCommand extends DiscordCommand{
    public inDev: boolean;

    constructor(){
        super()
        this.inDev = true;
        this.properties
        .setName("schedule_request_cancel")
        .setDescription("cancels an ongoing scheduleRequest with another team")
    }
    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const issuerTeamPlayer = await teamBot.prisma.teamPlayer.findFirst({
            where: {playerId: interaction.user.id},
            include: {team: {select: {scheduleRequestsIn: {select: {requesterTeam: true, state: true}}, scheduleRequestsOut: {select: {receiverTeam: true, state: true}}}}}
        })

        if(!issuerTeamPlayer?.isCaptain || !issuerTeamPlayer.isCoCap){
            interaction.reply({embeds: [new UserNotCaptainOrEmbed], ephemeral: true})
            return;
        }
        //@ts-ignore
        const allRequests = issuerTeamPlayer.team.scheduleRequestsIn.concat(issuerTeamPlayer.team.scheduleRequestsOut);
        const allAcceptedRequests = allRequests.filter(request => {return request.state == "ACCEPTED"})
        


    }
    
}