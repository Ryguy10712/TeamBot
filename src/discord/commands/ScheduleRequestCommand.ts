import { ButtonBuilder, ButtonInteraction, CacheType, Client, CommandInteraction, Component, ComponentType, DMChannel, SelectMenuInteraction, SelectMenuOptionBuilder, ThreadMemberFlagsBitField, UserPremiumType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import { PCLTeam } from "../../interfaces/PCLTeam";
import { AcceptButton, DenyButton, MatchTypeRow, RequestRow, TeamListMenu, TeamListRow } from "../components/ScheduleRequestComponents";
import { ScheduleRequest, MatchType } from "../../interfaces/ScheduleRequest";
import { register } from "ts-node";

export default class ScheduleRequestCommand extends DiscordCommand {
    public inDev: boolean = true;

    constructor() {
        super();
        this.properties.setName("schedule_request").setDescription("poopoo pee pee cacac");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        const issuerPlayer = teamBot.findPCLPlayerByDiscord(interaction.user.id);
        //check to see if this person is cap or co-cap of a team
        if (!registeredTeams.some((pclPlayer) => {
                return pclPlayer.captain === interaction.user.id || pclPlayer.coCap === interaction.user.id;
            })
          ) {
            return interaction.reply("poopoo"); //poopoo pee pee
        }
        //at this point the user IS a cocaptain
        const issuerTeam = registeredTeams.find((pclTeam) => {
            return pclTeam.captain === interaction.user.id || pclTeam.coCap === interaction.user.id;
        })!;
        if(!issuerTeam.schedulingChannel) return interaction.reply("In order to use this command you must have a scheduling channel")
        let TeamListMenuParams: SelectMenuOptionBuilder[] = []
        for (const team of registeredTeams) {
            if (team.rank === issuerTeam.rank && team.schedulingChannel) { //the otherteam must have a scheduling channel in order for it to show up
                const option = new SelectMenuOptionBuilder()
                    .setLabel(team.name)
                    .setValue(`schedreq${team.name}`)
                TeamListMenuParams.push(option)
              }
        }
        const menu = new TeamListMenu(TeamListMenuParams)
        const reply = await interaction.reply({components: [new TeamListRow(menu!), new MatchTypeRow], content: "poopoo"})
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
        //handle button press
        const buttonFilter = (i: ButtonInteraction) => {
            if(i.deferred) return false;
            i.deferUpdate()
            return i.user.id === interaction.user.id
        }
        const buttonInteraction = await reply.awaitMessageComponent({filter: buttonFilter, componentType: ComponentType.Button, time: 120_000})
        if(!selectedTeam) return interaction.followUp("Select a team first")
        //determine matchType
        let matchType: MatchType;
        if(buttonInteraction.customId === "schedreqMatch") matchType = MatchType.MATCH;
        if(buttonInteraction.customId === "schedreqChallenge") matchType = MatchType.CHALLENGE;
        if(buttonInteraction.customId === "schedreqScrim") matchType = MatchType.SCRIM;
        let registeredMatches: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"))
        const requestId = registeredMatches.length == 0 ? 0 : registeredMatches[registeredMatches.length - 1].id + 1 //set the match ID one above the last match
        //get captain of other team and dm them
        const opponentCaptainId = registeredTeams.find(pclTeam => {return pclTeam.name === selectedTeam})!.captain
        const opponentCoCaptainId = registeredTeams.find(pclTeam => {return pclTeam.name === selectedTeam})!.coCap
        const opponentCaptainUser = await client.users.fetch(opponentCaptainId);
        //evaluate wether or not a co-captain exists
        const opponentCoCaptainUser = opponentCoCaptainId ? await client.users.fetch(opponentCoCaptainId) : null 
        const capMsg = await opponentCaptainUser.send({content: "this is maybe a scheduling request", components: [RequestRow]})
        const coCapMsg = opponentCoCaptainUser ? await opponentCoCaptainUser.send("||RUNRUNRUNRUN||") : null
        //co cap msg id is null if co cap doesnt exist
        const schedRequest: ScheduleRequest = coCapMsg ? {
            id: requestId,
            requester: issuerTeam.name,
            opponent: selectedTeam,
            captainMsgId: capMsg.id,
            coCaptainMsgId: coCapMsg.id,
            requestChanId: capMsg.channelId,
            type: matchType!,
            accepted: false
        } : {
            id: requestId,
            requester: issuerTeam.name,
            opponent: selectedTeam,
            captainMsgId: capMsg.id,
            coCaptainMsgId: null,
            requestChanId: capMsg.channelId,
            type: matchType!,
            accepted: false
        }
        registeredMatches.push(schedRequest)
        fs.writeFileSync("./db/scheduleRequests.json", JSON.stringify(registeredMatches))
        


        
        
        



    }
}
