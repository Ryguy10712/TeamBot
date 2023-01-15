export enum Ranks {
    GOLD,
    SILVER,
    BRONZE,
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type time = "one" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "eleven" | "twelve"

export type HourReaction = "1PM" | "2PM" | "3PM" | "4PM" | "5PM" | "6PM" | "7PM" | "8PM" | "9PM" | "10PM" | "11PM" | "12PM";

export interface availability {
    one?: boolean;
    two?: boolean;
    three?: boolean
    four?: boolean;
    five?: boolean;
    six?: boolean;
    seven?: boolean;
    eight?: boolean;
    nine?: boolean;
    ten?: boolean;
    eleven?: boolean;
    twelve?: boolean;
}

export interface PCLTeam {
    name: string;
    players: string[];
    rank: Ranks | undefined;
    guildID: string | undefined;
    confidential: boolean;
    isWeeklySchedulingPollsEnabled: boolean | undefined;
    captain: string;
    coCap: string | undefined;
    schedulingChannel: string | null;
    availability: {
        messageIds: string[];
        tuesday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        wednesday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        thursday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        friday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        saturday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        sunday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
        monday: {
            "1PM": string[];
            "2PM": string[];
            "3PM": string[];
            "4PM": string[];
            "5PM": string[];
            "6PM": string[];
            "7PM": string[];
            "8PM": string[];
            "9PM": string[];
            "10PM": string[];
            "11PM": string[];
            "12PM": string[];
        };
    } | null;
}
