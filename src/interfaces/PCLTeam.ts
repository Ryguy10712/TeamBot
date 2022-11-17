import PCLPlayer from "./PCLPlayer"
export enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export interface PCLTeam {
    name: string
    players: string[];
    rank: Ranks | undefined
    guildID: string | undefined,
    confidential: boolean
    isWeeklySchedulingPollsEnabled: boolean | undefined,
    captain: string
    coCap: string | undefined
}