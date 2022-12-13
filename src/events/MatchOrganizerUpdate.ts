import { ButtonInteraction } from "discord.js";
import { TeamBot } from "../Bot";
import fs from "fs"
import { ScheduleRequest } from "../interfaces/ScheduleRequest";
import { PCLTeam } from "../interfaces/PCLTeam";

export async function execute(teamBot: TeamBot, interaction: ButtonInteraction){
  const schedReqDb: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"))
  const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
  const schedReqId = parseInt(interaction.customId.replace("matchOrganizerUdate", ""))
  const schedReq = schedReqDb.find(schedReq => {schedReq.id === schedReqId})

  if(!schedReq) return interaction.reply("this is no longer available")
  const requesterTeam = teamsDb.find(pclTeam => {pclTeam.name === schedReq.requester})
  const accepterTeam = teamsDb.find(pclTeam => {pclTeam.name === schedReq.opponent})

  if(!requesterTeam) return interaction.reply(`${schedReq.requester} is no longer a team`)
  if(!accepterTeam) return interaction.reply(`${schedReq.opponent} is no longer a team`)

  
}