import PCLPlayer from "./PCLPlayer"
enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export default interface PCLTeam {
    players: PCLPlayer[];
    rank: Ranks
    guildID: string,
    isWeeklySchedulingPollsEnabled: boolean
}