import { PrismaClient, Team } from "@prisma/client";
import { SelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { ScheduleRequestAcceptButton } from "../buttons/ScheduleRequestAccept";
import { ScheduleRequestDenyButton } from "../buttons/ScheduleRequestDeny";
import { DiscordButton } from "../DiscordButton";

//Components
export class TeamListMenu extends SelectMenuBuilder {
    prisma: PrismaClient;
    issuerTeam: Team;
    constructor(issuerTeam: Team, prisma: PrismaClient) {
        super()
        this.prisma = prisma;
        this.issuerTeam = issuerTeam;
        this.setCustomId("schedreqTeams");
    }

    async init() {
        const teams = await this.prisma.team.findMany({
            where: {
                NOT: [{ schedulingChannel: null }],
            },
        });
        const teamsInOrder = teams.filter((team) => {
            return team.rank === this.issuerTeam.rank;
        });
        const remainingTeams = teams.filter((team) => {
            return !teamsInOrder.includes(team);
        });
        teamsInOrder.concat(remainingTeams)

        for(const team of teamsInOrder){
            this.addOptions({
                label: team.name,
                value: `schedreq${team.name}`
            })
        }
    }
}

export const ScrimButton = new ButtonBuilder().setCustomId("schedreqScrim").setLabel("Scrim").setStyle(ButtonStyle.Primary);

export const ChallengeButton = new ButtonBuilder().setCustomId("schedreqChallenge").setLabel("Challenge").setStyle(ButtonStyle.Primary);

export const MatchButton = new ButtonBuilder().setCustomId("schedreqMatch").setLabel("Match").setStyle(ButtonStyle.Primary);

export const AcceptButton = new ButtonBuilder().setCustomId("schedreqAccept").setLabel("Accept").setStyle(ButtonStyle.Success);

export const DenyButton = new ButtonBuilder().setCustomId("schedreqDeny").setLabel("Decline").setStyle(ButtonStyle.Danger);

//ActionRows
export class TeamListRow extends ActionRowBuilder<SelectMenuBuilder> {
    team: Team
    prisma: PrismaClient

    constructor(team: Team, prisma: PrismaClient){
        super()
        this.team = team
        this.prisma = prisma
    }
    async init(){
        const menu = new TeamListMenu(this.team, this.prisma)
        await menu.init()
        this.addComponents(menu)
    }
}

export class MatchTypeRow extends ActionRowBuilder<ButtonBuilder> {
    constructor() {
        super();
        this.setComponents(MatchButton, ChallengeButton, ScrimButton);
    }
}

export class RequestRow extends ActionRowBuilder<DiscordButton> {
    constructor(enabled?: boolean) {
        super();
        const acceptBtn = new ScheduleRequestAcceptButton();
        const denyBtn = new ScheduleRequestDenyButton();
        if (enabled === false) {
            acceptBtn.setDisabled(true);
            denyBtn.setDisabled(true);
        }
        this.addComponents(acceptBtn);
        this.addComponents(denyBtn);
    }
}
