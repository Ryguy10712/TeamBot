import { Client, ButtonInteraction, CacheType, GuildTextBasedChannel, ButtonStyle } from "discord.js";
import { PCLTeam } from "../../interfaces/PCLTeam";
import { ScheduleRequest } from "../../interfaces/ScheduleRequest";
import { DiscordButton } from "../DiscordButton";
import fs from "fs";
import { MatchOrganizerEmbed, UpdateButtonRow } from "../components/RequestAcceptComponents";
import { RequestRow } from "../components/ScheduleRequestComponents";
import { TeamBot } from "../../Bot";

export class ScheduleRequestAcceptButton extends DiscordButton {
    public id: string;

    constructor() {
        super();
        this.id = "schedreqAccept";
        this.setLabel("Accept");
        this.setStyle(ButtonStyle.Success);
        this.setCustomId(this.id);
    }

    async execute(teamBot: TeamBot, client: Client<boolean>, interaction: ButtonInteraction<CacheType>) {
        await interaction.deferUpdate(); //prevents failed msg
        const scheduleRequests: ScheduleRequest[] = JSON.parse(fs.readFileSync("./db/scheduleRequests.json", "utf-8"));
        const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));
        const schedReq = scheduleRequests.find((schedreq) => {
            return interaction.message.id == schedreq.captainMsgId;
        })!;

        if (!schedReq) return interaction.reply("this schedule request is no longer available");

        const requesterCaptainId = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.requester;
        })!.captain;
        const requesterCoCaptainId = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.requester;
        })!.coCap;
        const requesterCaptainUser = await client.users.fetch(requesterCaptainId);
        const requesterCoCaptainUser = requesterCoCaptainId ? await client.users.fetch(requesterCoCaptainId) : null;

        //time for the beef
        const requesterPclTeam = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.requester;
        })!;
        const accepterPclTeam = registeredTeams.find((pclTeam) => {
            return pclTeam.name === schedReq.opponent;
        })!;

        try {
            const requesterSchedulingChan = (await client.channels.fetch(requesterPclTeam.schedulingChannel!)) as GuildTextBasedChannel;

            const accepeterSchedulingChan = (await client.channels.fetch(accepterPclTeam.schedulingChannel!)) as GuildTextBasedChannel;

            //let requester captain know
            requesterCaptainUser.send("THE REQUEST HAS BEEN ACCEPTED RAHHHHHH");
            //disable the buttons
            interaction.message.edit({ components: [new RequestRow(false)] });
            //if applicable, let requester coCap know
            if (requesterCoCaptainUser) requesterCoCaptainUser.send("THE SCHEDULE REQUEST HAS BEEN ACCEPTED RAHHH (you are a stinky co captain)");

            requesterSchedulingChan.send({
                embeds: [new MatchOrganizerEmbed(requesterPclTeam, accepterPclTeam, schedReq.type)],
                components: [new UpdateButtonRow(schedReq.id, teamBot)],
            });
            accepeterSchedulingChan.send({
                embeds: [new MatchOrganizerEmbed(accepterPclTeam, requesterPclTeam, schedReq.type)],
                components: [new UpdateButtonRow(schedReq.id, teamBot)],
            });
        } catch {
            interaction.followUp("There was an unexpected error and the schedule request has been terminated")
            scheduleRequests.splice(scheduleRequests.indexOf(schedReq), 1)
            fs.writeFileSync("./db/scheduleRequests.json", JSON.stringify(scheduleRequests))
        }
    }
}
