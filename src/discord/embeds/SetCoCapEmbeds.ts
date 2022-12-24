import {EmbedBuilder } from "discord.js";

export class CoCapSetEmbed extends EmbedBuilder{
    constructor(){
        super()
        this.setColor("Green")
        this.setFields({
            name: "Success:",
            value: "The player has been set as your co-captain"
        })
    }
}