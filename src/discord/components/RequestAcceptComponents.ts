import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js"
import { TeamBot } from "../../Bot"
import { PCLTeam } from "../../interfaces/PCLTeam"
import { MatchType } from "../../interfaces/ScheduleRequest"
import { MatchOrganizerUpdateButton } from "../buttons/OrganizerUpdate"

export class MatchOrganizerEmbed extends EmbedBuilder {
  
  constructor(team: PCLTeam, opponent: PCLTeam, type: MatchType){
    super()
    this.setColor("DarkButNotBlack")
    this.setTitle(`${MatchType[type]} vs ${opponent.name}`)
    this.data.fields = [
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
    ]

    //fuck intellisense type checking
    type time = "1PM" | "2PM" | "3PM" | "4PM" | "5PM" | "6PM" | "7PM" | "8PM" | "9PM" | "10PM" | "11PM" | "12PM";
    type tDaysOfWeek = "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "monday"
    const daysOfWeek = ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"]

    for(const day of daysOfWeek){
        Object.entries(team.availability![day as tDaysOfWeek]).forEach(entry => {
            //if both teams have greater than 5 ppl
            if(entry[1].length >= 5 && opponent.availability![day as tDaysOfWeek][entry[0] as time].length >= 5){ //change to preference in the future
                const field = this.data.fields!.find(field => {return field.name.toLowerCase() === day})!
                field.value = field.value.replace("...", "")
                field.value += `${entry[0]} 🟢\n`
            }
        })
    }
    
  }
}

export class UpdateButton extends ButtonBuilder {
    constructor(scheduleRequestId: number){
        super()
        this.setStyle(ButtonStyle.Primary)
        this.setLabel("Update")
        this.setCustomId(`matchOrganizerUpdate${scheduleRequestId}`)
    }
}

export class UpdateButtonRow extends ActionRowBuilder<MatchOrganizerUpdateButton> {
    constructor(scheduleRequestId: number, teamBot: TeamBot){
        super()
        const btn = new MatchOrganizerUpdateButton(scheduleRequestId)
        this.addComponents(btn)
        teamBot.persistentButtons.set(btn.id, btn)
    } 
}

export class RequesterChanDeleted extends EmbedBuilder {
  constructor(){
    super()
    this.setColor("Red")
    this.setTitle("Bruh")
    this.setFields({
      name: "Failed:",
      value: "The requesting team has deleted their scheduling channel."
    })
    this.setFooter({text: "The schedule request has been terminated"})
  }
}

export class AccepterChanDeleted extends EmbedBuilder {
  constructor(){
    super()
    this.setColor("Red")
    this.setTitle("Bruh")
    this.setFields({
      name: "Failed",
      value: "You have deleted your set scheduling channel"
    })
    this.setFooter({text: "The schedule request has been terminated"})
  }
}