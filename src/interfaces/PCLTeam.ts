import PCLPlayer from "./PCLPlayer"
export enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export interface PCLTeam {
    players: PCLPlayer[];
    rank: Ranks | undefined
    guildID: string,
    isWeeklySchedulingPollsEnabled: boolean
}