import { SelectMenuBuilder } from "@discordjs/builders";
import { ScheduleRequest } from "@prisma/client";

export class CancelMenu extends SelectMenuBuilder {
    private issuerTeamId: number
    private ongoingRequests: ScheduleRequest[]
    
    constructor(issuerTeamId: number, ongoingRequests: ScheduleRequest[]){
        super()
        this.issuerTeamId = issuerTeamId
        this.ongoingRequests = ongoingRequests
        this.setCustomId(`cancelMenu${issuerTeamId}`)
    }
    
    async init(){
        for(const request of this.ongoingRequests){
            if(request.receiverId == this.issuerTeamId){
                
            }
        }
    }
}