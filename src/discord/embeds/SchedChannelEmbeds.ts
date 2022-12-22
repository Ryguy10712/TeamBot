import { EmbedBuilder } from "discord.js";

export class SchedChanSetEmbed extends EmbedBuilder {
    constructor(schedChanId: string){
        super()
        this.setTitle("You got it!")
        this.setColor("Green")
        this.setFields({
            name: "Success:",
            value: `<#${schedChanId}> is now your scheduling channel`
        })
    }
}

export class WrongChannelTypeEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setTitle("A misclick eh?")
        this.setColor("Red")
        this.setFields({
            name: "Failed:",
            value: "Use an actual text-based server channel please"
        })
    }
}

export class NoTeamEmbed extends EmbedBuilder {
    constructor(){
        super()
        this.setTitle("Getting ahead of yourself, eh?")
        this.setColor("Red")
        this.setFields({
            name: "Failed:",
            value: "You must create a team before you can set a scheduling channel"
        })
        this.setFooter({text: "stupid"})
    }
}