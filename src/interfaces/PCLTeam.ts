import PCLPlayer from "./PCLPlayer"
export enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export interface PCLTeam {
    name: string
    players: PCLPlayer[];
    rank: Ranks | undefined
    guildID: string | undefined,
    confidential: boolean
    isWeeklySchedulingPollsEnabled: boolean | undefined,
    captain: PCLPlayer,
    coCap: PCLPlayer | undefined
}