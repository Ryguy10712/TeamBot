import {SelectMenuBuilder, ButtonBuilder, ActionRowBuilder, Team, ButtonStyle, SelectMenuOptionBuilder} from "discord.js"

//Components
export class TeamListMenu extends SelectMenuBuilder {
  constructor(params: SelectMenuOptionBuilder[]){
    super()
    this.setCustomId("schedreqTeams")
    for(const option of params){
      this.addOptions(option)
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
  constructor(teamListMenu: TeamListMenu){
    super()
    this.setComponents(teamListMenu)
  }
}

export class MatchTypeRow extends ActionRowBuilder<ButtonBuilder> {
  constructor(){
    super()
    this.setComponents(MatchButton, ChallengeButton, ScrimButton)
  }

}

export const RequestRow = new ActionRowBuilder<ButtonBuilder>()
.setComponents(AcceptButton, DenyButton)