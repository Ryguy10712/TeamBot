import { ButtonInteraction, CacheType, Client, CommandInteraction, ComponentType, SelectMenuInteraction } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import { MatchTypeRow, RequestRow, TeamListRow } from "../components/ScheduleRequestComponents";
import { IncomingRequestEmbed, RequestSentEmbed, SchedReqPrimaryEmbed } from "../embeds/ScheduleRequestEmbeds";
import { DisposedInteraction, UserNotCaptainOrEmbed } from "../embeds/CommonEmbeds";
import { MatchType } from "../../types";

export default class ScheduleRequestCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties.setName("schedule_request").setDescription("Set up a match with another team");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const issuerPlayer = await teamBot.prisma.teamPlayer.findFirst({where: {playerId: interaction.user.id}, include: {team: true}})
        //check to see if this person is cap or co-cap of a team
        if(!issuerPlayer?.isCaptain && !issuerPlayer?.isCoCap){
            interaction.reply({embeds: [new UserNotCaptainOrEmbed()], ephemeral: true})
        }
        //at this point the user IS a cocaptain
        
        if(!issuerPlayer!.team.schedulingChannel) return interaction.reply("In order to use this command you must have a scheduling channel")
        const teams = await teamBot.prisma.team.findMany({
            where: {
                NOT: [
                    {
                        schedulingChannel: null, confidential: true
                    }
                ]
            }
        })
        const row = new TeamListRow(issuerPlayer!.team, teamBot.prisma)
        await row.init()
        const reply = await interaction.reply({components: [row, new MatchTypeRow], embeds: [new SchedReqPrimaryEmbed], ephemeral: true})
        let selectedTeam: string | undefined = undefined
        const menuFilter = (i: SelectMenuInteraction) => {
          if (i.deferred || i.customId != "schedreqTeams") return false;
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        }
        const menuCollector = reply.createMessageComponentCollector({filter: menuFilter, componentType: ComponentType.StringSelect, time: 120_000 })
        menuCollector.on("collect", menuInteraction => {
          selectedTeam = menuInteraction.values[0].replace("schedreq", "")
        })
        menuCollector.on("end", () => {
            if(menuCollector.endReason != "time"){
                return
            }
            interaction.editReply({embeds: [new DisposedInteraction]})
        })
        //handle button press
        const buttonFilter = (i: ButtonInteraction) => {
            return i.user.id === interaction.user.id
        }
        const buttonInteraction = await reply.awaitMessageComponent({filter: buttonFilter, componentType: ComponentType.Button, time: 120_000}).catch(() => {return}) as ButtonInteraction<CacheType>
        if(!buttonInteraction) return interaction.editReply({embeds: [new DisposedInteraction]}) //user did not pick a button
        if(!selectedTeam) return interaction.editReply("Select a team first")
        //determine matchType
        let matchType: MatchType;
        if(buttonInteraction.customId === "schedreqMatch") matchType = MatchType.MATCH;
        if(buttonInteraction.customId === "schedreqChallenge") matchType = MatchType.CHALLENGE;
        if(buttonInteraction.customId === "schedreqScrim") matchType = MatchType.SCRIM;
        //get captain of other team and dm them
        const oppTeam = teams.find(team => {return team.name == selectedTeam})!
        const oppCapAndCoCap = await teamBot.prisma.teamPlayer.findMany({where: { //query gets both captain and cocaptain
            teamId: oppTeam.id,
            OR: [{isCaptain: true}, {isCoCap: true}]
        }})
        const oppCaptain = oppCapAndCoCap.find(teamPlayer => {return teamPlayer.isCaptain})!
        const oppCoCaptain = oppCapAndCoCap.find(teamPlayer => {return teamPlayer.isCoCap})!
        const opponentCaptainUser = await client.users.fetch(oppCaptain.playerId)
        //evaluate wether or not a co-captain exists
        const opponentCoCaptainUser = oppCoCaptain ? await client.users.fetch(oppCoCaptain.playerId) : null 
        const capMsg = await opponentCaptainUser.send({embeds: [new IncomingRequestEmbed(issuerPlayer?.team.name!, matchType!)], components: [new RequestRow()]})
        const coCapMsg = opponentCoCaptainUser ? await opponentCoCaptainUser.send({embeds: [new IncomingRequestEmbed(issuerPlayer?.team.name!, matchType!)], components: [new RequestRow()]}) : null
        teamBot.prisma.scheduleRequest.create({
            data: {
                requesterId: issuerPlayer!.teamId,
                type: matchType!,
                receiverId: oppTeam.id,
                captainMsgId: capMsg.id,
                coCaptainMsgId: coCapMsg?.id,

            },
            
        }).then(() => {
            teamBot.prisma.$disconnect()
            buttonInteraction.editReply({embeds: [new RequestSentEmbed(selectedTeam!)]}) 
            buttonInteraction.replied = true; //button handler will acknowledge this
        })
        .catch(() => {interaction.editReply("An unxpected error occured and the schedule request will be terminatd")})
        //co cap msg id is null if co cap doesnt exist
        
       
        


        
        
        



    }
}
