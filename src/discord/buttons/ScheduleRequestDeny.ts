import { Client, ButtonInteraction, CacheType, DMChannel, ButtonStyle } from "discord.js";
import { DiscordButton } from "../DiscordButton";
import fs from "fs";
import { ScheduleRequest } from "../../interfaces/ScheduleRequest";
import { PCLTeam } from "../../interfaces/PCLTeam";
import { TeamBot } from "../../Bot";

export class ScheduleRequestDenyButton extends DiscordButton {
    public id: string;

    constructor() {
        super();
        this.id = "schedreqDeny";
        this.setLabel("Decline")
        this.setStyle(ButtonStyle.Danger)
        this.setCustomId(this.id)
    }

    async execute(teamBot: TeamBot, client: Client<boolean>, interaction: ButtonInteraction<CacheType>) {
        const schedReqDb: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))

        const schedReq = schedReqDb.find((schedReq) => {
            return schedReq.captainMsgId === interaction.message.id || schedReq.coCaptainMsgId === interaction.message.id;
        })!;

        schedReqDb.splice(schedReqDb.indexOf(schedReq), 1)
        fs.writeFileSync("./db/scheduleRequests.json", JSON.stringify(schedReqDb))

        const requesterTeam: PCLTeam = teamsDb.find(pclTeam => {return pclTeam.name === schedReq.requester})!
        const declinerTeam: PCLTeam = teamsDb.find(pclTeam => {return pclTeam.name === schedReq.opponent})!

        const requestChannel = await client.channels.fetch(schedReq.requestChanId) as DMChannel
        const requestMsg = await requestChannel.messages.fetch(schedReq.captainMsgId)

        requestMsg.reply("this has been denied")

        
    }
}
