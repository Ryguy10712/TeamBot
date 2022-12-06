export interface TeamBotEvents {
    scheduleRequestAccept: null
    scheduleRequestDeny: null
}

export interface EventExecutable {
    execute: () => void;
}