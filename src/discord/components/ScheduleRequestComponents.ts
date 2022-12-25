import {SelectMenuBuilder, ButtonBuilder, ActionRowBuilder, Team, ButtonStyle, SelectMenuOptionBuilder} from "discord.js"
import fs from "fs"
import { TeamBot } from "../../Bot"
import { PCLTeam } from "../../interfaces/PCLTeam"
import { ScheduleRequestAcceptButton } from "../buttons/ScheduleRequestAccept"
import { ScheduleRequestDenyButton } from "../buttons/ScheduleRequestDeny"
import { DiscordButton } from "../DiscordButton"

//Components
export class TeamListMenu extends SelectMenuBuilder {
  constructor(issuerTeam: PCLTeam){
    super()
    this.setCustomId("schedreqTeams")
    const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
    let teamsList = teamsDb.filter(pclTeam => { //only return non-secret teams and has set scheduling channel
      return pclTeam.schedulingChannel && !pclTeam.confidential 
    })
    //sort teams in the correct orderz
    const teamsInOrder = teamsList.filter(team => {
      return team.rank === issuerTeam.rank
    })

    for(const team of teamsList){
      if(!teamsInOrder.includes(team)){
        teamsInOrder.push(team)
      }
    }

    for(const team of teamsInOrder){
      this.addOptions({
        label: team.name,
        value: `schedreq${team.name}`
      })
    }

  }
}

export const ScrimButton = new ButtonBuilder()
  .setCustomId("schedreqScrim")
  .setLabel("Scrim")
  .setStyle(ButtonStyle.Primary)

export const ChallengeButton = new ButtonBuilder()
  .setCustomId("schedreqChallenge")
  .setLabel("Challenge")
  .setStyle(ButtonStyle.Primary)

export const MatchButton = new ButtonBuilder()
  .setCustomId("schedreqMatch")
  .setLabel("Match")
  .setStyle(ButtonStyle.Primary)

export const AcceptButton = new ButtonBuilder()
  .setCustomId("schedreqAccept")
  .setLabel("Accept")
  .setStyle(ButtonStyle.Success)

export const DenyButton = new ButtonBuilder()
  .setCustomId("schedreqDeny")
  .setLabel("Decline")
  .setStyle(ButtonStyle.Danger)

//ActionRows
export class TeamListRow extends ActionRowBuilder<SelectMenuBuilder> {
  constructor(issuerTeam: PCLTeam){
    super()
    this.setComponents(new TeamListMenu(issuerTeam))
  }
}

export class MatchTypeRow extends ActionRowBuilder<ButtonBuilder> {
  constructor(){
    super()
    this.setComponents(MatchButton, ChallengeButton, ScrimButton)
  }

}


export class RequestRow extends ActionRowBuilder<DiscordButton> {
  constructor(enabled?: boolean){
    super()
    const acceptBtn = new ScheduleRequestAcceptButton()
    const denyBtn = new ScheduleRequestDenyButton()
    if(enabled === false) {
      acceptBtn.setDisabled(true)
      denyBtn.setDisabled(true)
    }
    this.addComponents(acceptBtn)
    this.addComponents(denyBtn)
    
    
    
  }
}
