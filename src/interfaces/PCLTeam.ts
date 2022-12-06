import PCLPlayer from "./PCLPlayer"
export enum Ranks {
    GOLD,
    SILVER,
    BRONZE
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export type HourReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛"

export interface PCLTeam {
    name: string
    players: string[];
    rank: Ranks | undefined
    guildID: string | undefined,
    confidential: boolean
    isWeeklySchedulingPollsEnabled: boolean | undefined,
    captain: string
    coCap: string | undefined
    schedulingChannel: string | null,
    availability : {
        messageIds: string[],
        tuesday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        wednesday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        thursday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        friday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        saturday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        sunday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
        monday: {"1️⃣": string[], "2️⃣": string[], "3️⃣": string[], "4️⃣": string[], "5️⃣":string[], "6️⃣":string[],"7️⃣":string[],"8️⃣":string[], "9️⃣":string[], "🔟":string[],"🕚":string[], "🕛":string[]},
    } | null
}