import { EmbedBuilder } from "discord.js";
import { MatchType } from "../../types";

export class RequestSentEmbed extends EmbedBuilder {
    constructor(teamName: string){
        super()
        this.setColor("Green")
        this.setTitle("Alrighty!")
        this.addFields({
            name: "Success",
            value: `Sent a scheduling request to ${teamName}`
        })
        
    }
}

export class SchedReqPrimaryEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("DarkButNotBlack")
        this.setTitle("Pick a team and match type")
        this.setDescription("If a team isn't listed, they have not set their scheduling channel yet. Maybe let them know eh?")
    }
}

export class IncomingRequestEmbed extends EmbedBuilder {
    constructor(team: string, type: MatchType){
        super()
        switch (type) {
            case 0:
                this.setColor("Red")
                break;
            case 1:
                this.setColor("Yellow")
                break;
            case 2: 
                this.setColor("Blue")
                break;
        }
        this.setTitle("Incoming schedule request!")
        this.setDescription(`${MatchType[type]} vs ${team}`)
    }
}

