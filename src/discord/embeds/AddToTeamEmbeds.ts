import { EmbedBuilder } from "discord.js";

export class PlayerAddSuccess extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("Green")
        this.setFields({
            name: "Success",
            value: "The player has been added to your team"
        })
    }
}

export class PlayerRemoveSuccess extends EmbedBuilder {
    constructor(){
        super()
        this.setColor("Green")
        this.setFields({
            name: "Success:",
            value: "The player has been removed from your team"
        })
    }
}