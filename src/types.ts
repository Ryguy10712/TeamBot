export enum Ranks {
    GOLD,
    SILVER,
    BRONZE,
}

export enum MatchType {
    MATCH,
    CHALLENGE,
    SCRIM,
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type time = "one" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "eleven" | "twelve";

export type HourReaction = "1PM" | "2PM" | "3PM" | "4PM" | "5PM" | "6PM" | "7PM" | "8PM" | "9PM" | "10PM" | "11PM" | "12PM";

export interface availability {
    one?: boolean;
    two?: boolean;
    three?: boolean;
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



