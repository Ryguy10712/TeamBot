import { BaseGuildTextChannel, ButtonInteraction, DMChannel, GuildNSFWLevel, GuildTextBasedChannel, Team } from "discord.js";
import fs from "fs";
import { TeamBot } from "../Bot";
import { PCLTeam } from "../interfaces/PCLTeam";
import { ScheduleRequest } from "../interfaces/ScheduleRequest";
import { MatchOrganizerEmbed } from "../discord/components/RequestAcceptComponents";

export async function HandleScheduleRequestAccept(teamBot: TeamBot, interaction: ButtonInteraction) {
    const scheduleRequests: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"));
    const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
    const schedReq = scheduleRequests.find((schedreq) => {
        return interaction.message.id == schedreq.captainMsgId;
    })!;

    const requesterCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    })!.captain;
    const requesterCoCaptainId = registeredTeams.find((pclTeam) => {
        return pclTeam.name === schedReq.requester;
    })!.coCap;
    const requesterCaptainUser = await teamBot.client.users.fetch(requesterCaptainId);
    const requesterCoCaptainUser = requesterCoCaptainId ? await teamBot.client.users.fetch(requesterCoCaptainId) : null;
    
    //let requester captain know 
    requesterCaptainUser.send("THE REQUEST HAS BEEN ACCEPTED RAHHHHHH"); 
    //if applicable, let requester coCap know
    if (requesterCoCaptainUser) requesterCoCaptainUser.send("THE SCHEDULE REQUEST HAS BEEN ACCEPTED RAHHH (you are a stinky co captain)");

    //time for the beef
    const requesterPclTeam = registeredTeams.find(pclTeam => {return pclTeam.name === schedReq.requester})!
    const accepterPclTeam = registeredTeams.find(pclTeam => {return pclTeam.name === schedReq.opponent})!

    const requesterSchedulingChan = await teamBot.client.channels.fetch(requesterPclTeam.schedulingChannel!) as GuildTextBasedChannel
    const accepeterSchedulingChan = await teamBot.client.channels.fetch(accepterPclTeam.schedulingChannel!) as GuildTextBasedChannel
    try {
      requesterSchedulingChan.send({embeds: [new MatchOrganizerEmbed(accepterPclTeam.name, schedReq.type)]})
      accepeterSchedulingChan.send({embeds: [new MatchOrganizerEmbed(requesterPclTeam.name, schedReq.type)]})
    } 
    catch {
      //Bot aint in server or some STUPID bullshit that people will do
    }
} 
