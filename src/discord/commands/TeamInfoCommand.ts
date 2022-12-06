import { Client, CommandInteraction, CacheType, EmbedBuilder, BaseGuildTextChannel } from "discord.js";
import { TeamBot } from "../../Bot";
import fs from "fs";
import { DiscordCommand } from "../DiscordCommand";
import { PCLTeam, Ranks } from "../../interfaces/PCLTeam";

export default class TeamInfoCommand extends DiscordCommand {
    public inDev: boolean = false;

    constructor() {
        super();
        this.properties.setName("team_info").setDescription("Shows your team's information");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const registeredTeams: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"))
        const issuerTeam: PCLTeam | undefined = registeredTeams.find(pclTeam => {return pclTeam.players.includes(interaction.user.id)})
        if(!issuerTeam) { //the user is not part of any tam
            const NoTeamEmbed = new EmbedBuilder().setColor("Red").setTitle("What team?").addFields({
                name: "Failed:",
                value: "You are not on any team"
            })
            return interaction.reply({embeds: [NoTeamEmbed]})
        }
        //at this point the user is on a team
        let description: string = ""
        const TeamInfoEmbed = new EmbedBuilder().setTitle(`${issuerTeam.name}:`).setColor("Blue")
        issuerTeam.players.forEach(player => {description += `-${teamBot.findPCLPlayerByDiscord(player)?.oculusId}\n`})
        TeamInfoEmbed.setDescription(description)
        //setting captain
        TeamInfoEmbed.addFields({
            name: "Captain:",
            value: teamBot.findPCLPlayerByDiscord(issuerTeam.captain)!.oculusId, 
            inline: true
        })
        //setting co cap
        if(issuerTeam.coCap){
            TeamInfoEmbed.addFields({name: "Co-Captain:", value: teamBot.findPCLPlayerByDiscord(issuerTeam.coCap)!.oculusId, inline: true})
        } else {
            TeamInfoEmbed.addFields({name: "Co-Captain:", value: "None", inline: true})
        }
        //setting rank
        switch(issuerTeam.rank){
            case 0:
                TeamInfoEmbed.addFields({"name": "Rank:", value: "Gold", inline: true})
                break;
            case 1: 
                TeamInfoEmbed.addFields({name: "Rank:", value: "Silver", inline: true})
                break;
            case 2: 
                TeamInfoEmbed.addFields({name: "Rank:", value: "Bronze", inline: true})
                break;
            default: 
                TeamInfoEmbed.addFields({name: "Rank:", value: "Unranked", inline: true})
                break;
        }
        //set scheduling channel
        if(issuerTeam.schedulingChannel === null){
            TeamInfoEmbed.addFields({name: "Scheduling Channel:", value: "None", inline: true})
        } else {
            TeamInfoEmbed.addFields({name: "Scheduling Channel:", value: `<#${issuerTeam.schedulingChannel}>`, inline: true})
        }
        //setting confidentiality
        if (issuerTeam.confidential) TeamInfoEmbed.addFields({name: "Confidential?", value: "Yes", inline: true})
        else TeamInfoEmbed.addFields({name: "Confidential?", value: "No", inline: true});
        interaction.reply({embeds: [TeamInfoEmbed]})
    }
}
