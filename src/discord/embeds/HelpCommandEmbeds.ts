import { EmbedBuilder } from "discord.js";



abstract class HelpEmbed extends EmbedBuilder {
    public abstract id: string;
}

class RegisterTeamHelpEmbed extends HelpEmbed {
    id: string;
    constructor() {
        super();
        this.id = "register_team";
        this.setTitle("/register_team");
        this.setDescription(
            `This command is essential for you to access most of teambots features. Once you register your team, you can add as many players as you'd like
            set a co-captain, and much more`
        );
        this.addFields(
            {
                name: "confidential",
                value: "Setting this to true will make it so nobody can see your team. Good for if you want to keep a new and upcoming team a secret",
            },
            {
                name: "cocap_discord/oculus",
                value: "determines the co-captain to your team. you can always set the co-captain later through the team menu command, or by right clicking on someones name"
            },
            {
                name: "rank",
                value: "Setting your rank is inessential, but will sort teams in the schedule_request command based on your rank."
            }
        );
        this.setFooter({text: "**Note:** in order to make schedule reqeusts you must set your scheduling channel using /scheduling_channel"})
    }
}

class ScheduleRequestHelpEmbed extends HelpEmbed {
    public id: string;
    constructor(){
        super()
        this.id = "schedule_request"
        this.setTitle("/schedule_request")
        this.setDescription(
            `This is the main feature of teambot. Once you pick a team and select a match type, your opponent will recieve a dm asking for a match. If they accept,
            an informational embed will appear in your scheduling channel containing dates where both you and your opponent have 5 players available. It can be updated on demand.`
        )
        this.setFooter({text: "**Note:** in order to make schedule reqeusts you must set your scheduling channel using /scheduling_channel"})
    }
}

class TeamMenuHelpEmbed extends HelpEmbed {
    public id: string
    constructor(){
        super()
        this.id = "team_menu"
        this.setTitle("/team_menu")
        this.setDescription("This lets you edit the aspects of your team that are listed below")
        this.setFields(
            {
                name: "Add Player",
                value: "Allows you to add a player to your team by __oculus username__",
                inline: true
            },
            {
                name: "Remove Player",
                value: "Same thing",
                inline: true
            },
            {
                name: "Set co-captain",
                value: "Same thing",
                inline: true
            },
            {
                name: "Edit Team Name",
                value: "Self-explanatory",
                inline: true
            },
            {
                name: "Set team confidentiality",
                value: "Wether or not your team should be kept secret",
                inline: true
            },
            {
                name: "Set rank",
                value: "Self-explanatory",
                inline: true
            }
        )
    }
}

export const embeds: HelpEmbed[] = [new RegisterTeamHelpEmbed, new ScheduleRequestHelpEmbed, new TeamMenuHelpEmbed]
