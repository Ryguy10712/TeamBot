import { EmbedBuilder } from "discord.js";

export class MisunderstoodButtonEmbed extends EmbedBuilder{
    constructor(buttonId: string){
        super()
        this.setColor("Orange")
        this.setTitle("I don't understand...")
        this.setFields({
            "name": "Notice:",
            "value": "I don't know what to do with this button. Try creating a new one eh?"
        })
        this.setFooter({text: `Id: ${buttonId}`})
    }
}