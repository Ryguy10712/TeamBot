import { ButtonInteraction, ButtonStyle, Client } from "discord.js";
import { ScheduleRequest } from "../../interfaces/ScheduleRequest";
import { PCLTeam } from "../../interfaces/PCLTeam";
import { DiscordButton } from "../DiscordButton";
import { MatchOrganizerEmbed } from "../components/RequestAcceptComponents";
import { TeamBot } from "../../Bot";
import fs from "fs"

export class MatchOrganizerUpdateButton extends DiscordButton {
    public id: string;
    constructor(scheduleRequestId: number){
        super()
        this.id = `matchOrganizerUpdate${scheduleRequestId}`
        this.setLabel("Update")
        this.setStyle(ButtonStyle.Primary)
        this.setCustomId(this.id)
        const buttonCache: string[] = JSON.parse(fs.readFileSync("./cache/persistentButtons.json", "utf-8"))
        if(buttonCache.includes(this.id)) return; //prevents duplicate entries
        buttonCache.push(this.id);
        fs.writeFileSync("./cache/persistentButtons.json", JSON.stringify(buttonCache))
    }
    
    async execute(teamBot: TeamBot, client: Client, interaction: ButtonInteraction) {
        interaction.deferUpdate()
        const schedReqDb: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"))
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
        const schedReqId = parseInt(interaction.customId.replace("matchOrganizerUpdate", ""))
        const schedReq = schedReqDb.find(schedReq => {return schedReq.id === schedReqId})

        if(!schedReq) return interaction.reply("this is no longer available")
        const requesterTeam = teamsDb.find(pclTeam => {return pclTeam.name === schedReq.requester})
        const accepterTeam = teamsDb.find(pclTeam => {return pclTeam.name === schedReq.opponent})

        if(!requesterTeam) return interaction.reply(`${schedReq.requester} is no longer a team`)
        if(!accepterTeam) return interaction.reply(`${schedReq.opponent} is no longer a team`)

        const homeTeam = teamsDb.find(pclTeam => {return pclTeam.schedulingChannel === interaction.channelId})! //team the embed is for 
        const awayTeam = homeTeam == requesterTeam ? accepterTeam : requesterTeam //the other team
        interaction.message.edit({embeds: [new MatchOrganizerEmbed(homeTeam, awayTeam, schedReq.type)]})
    }
}