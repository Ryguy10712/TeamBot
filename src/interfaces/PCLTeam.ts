import PCLPlayer from "./PCLPlayer"
export enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export interface PCLTeam {
    players: PCLPlayer[];
    rank: Ranks | undefined
    guildID: string | undefined,
    isWeeklySchedulingPollsEnabled: boolean | undefined,
    captain: PCLPlayer,
    coCap: PCLPlayer | undefined
}