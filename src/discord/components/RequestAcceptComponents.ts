import {EmbedBuilder} from "discord.js"
import { MatchType } from "../../interfaces/ScheduleRequest"

export class MatchOrganizerEmbed extends EmbedBuilder {
  
  constructor(opposingTeam: string, type: MatchType){
    super()
    this.setColor("DarkButNotBlack")
    this.setTitle(`${MatchType[type]} vs ${opposingTeam}`)
    this.addFields(
      {
        name: "Tuesday",
        value: "...",
        inline: true
      },
      {
        name: "Wednesday",
        value: "...",
        inline: true
      },
      {
        name: "Thursday",
        value: "...",
        inline: true
      },
      {
        name: "Friday",
        value: "...",
        inline: true
      },
      {
        name: "Saturday",
        value: "...",
        inline: true
      },
      {
        name: "Sunday",
        value: "...",
        inline: true
      },
      {
        name: "Monday",
        value: "...",
        inline: true
      }
    )

    
  }
}