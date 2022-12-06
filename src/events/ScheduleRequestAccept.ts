import { BaseGuildTextChannel, ButtonInteraction, DMChannel, GuildTextBasedChannel, Team } from "discord.js";
import fs from "fs";
import { TeamBot } from "../Bot";
import { PCLTeam } from "../interfaces/PCLTeam";
import { ScheduleRequest } from "../interfaces/ScheduleRequest";

export async function HandleScheduleRequestAccept(teamBot: TeamBot, interaction: ButtonInteraction) {
    const scheduleRequests: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"));
    const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
    const schedReq = scheduleRequests.find((schedreq) => {
        return interaction.message.id == schedreq.captainMsgId;
    })!;
    const accepterTeam = scheduleRequests.find((schedreq) => {
        return schedreq.captainMsgId === interaction.message.id;
    })!.opponent;
    const accepterChanId = registeredTeams.find((pclTeam) => {
        return pclTeam.name == accepterTeam;
    })!.schedulingChannel!;

    const requesterCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    })!.captain;
    const requesterCoCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    })!.coCap;
    const requesterCaptainUser = await teamBot.client.users.fetch(requesterCaptainId);
    const requesterCoCaptainUser = requesterCoCaptainId ? await teamBot.client.users.fetch(requesterCoCaptainId) : null;
    
    requesterCaptainUser.send("THE REQUEST HAS BEEN ACCEPTED RAHHHHHH");
    if (requesterCoCaptainUser) requesterCoCaptainUser.send("THE SCHEDULE REQUEST HAS BEEN ACCEPTED RAHHH (you are a stinky co captain)");

    //time for the beef
    const requesterPclTeam = registeredTeams.find(pclTeam => {return pclTeam.name === schedReq.requester})!
    const accepterPclTeam = registeredTeams.find(pclTeam => {return pclTeam.name === schedReq.opponent})!

    const requesterSchedulingChan = await teamBot.client.channels.fetch(requesterPclTeam.schedulingChannel!) as GuildTextBasedChannel
    const accepeterSchedulingChan = await teamBot.client.channels.fetch(accepterPclTeam.schedulingChannel!) as GuildTextBasedChannel
    try {
      requesterSchedulingChan.send("normally i would fill up this channel with reactions but i dont feel like it");
      accepeterSchedulingChan.send("normally i would fill up this channel with reactions but i dont feel like it");
    } 
    catch {
      //Bot aint in server or some stupid bullshit that people will do
    }
} 
