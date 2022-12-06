export enum MatchType {
    MATCH,
    CHALLENGE,
    SCRIM
}

export interface ScheduleRequest {
    id: number,
    requester: string
    opponent: string
    captainMsgId: string
    coCaptainMsgId: string | null
    requestChanId: string,
    type: MatchType
    accepted: boolean
    
}