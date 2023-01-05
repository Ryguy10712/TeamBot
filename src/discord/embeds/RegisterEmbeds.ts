import { Embed, EmbedBuilder } from "discord.js";

//SUCCCESS
export class RegisterSuccess extends EmbedBuilder {
    constructor(oculusId: string){
        super()
        this.setColor("Green")
        this.setTitle("Nice to meet ya!")
        this.setFields({
            name: "Success",
            value: `Your oculusId is now set to **${oculusId}**`
        })
    }
}

export let UpdateSuccess = new EmbedBuilder()
    .setTitle("Updated!")
    //fields set during runtime
    .setColor("Green")

//ERROR
export const InvalidIdError = new EmbedBuilder()
    .setTitle("That's not your name...")
    .setFields({
        name: "Failed:",
        value: "Oculus usernames must be 3-30 characters, and can only contain letters, numbers, periods, and underscores",
    })
    .setColor("Red");

export const IdMatchError = new EmbedBuilder()
    .setTitle("We've met before...")
    //fields set during runtime
    .setColor("Orange")
    .setFields({
        name: "Warning:",
        value: "That is already your username"
    })
    .setFooter({"text": "Bro fr forgot their own name 💀"})

export const UserNameExistsError = new EmbedBuilder()
    .setTitle("How original...")
    .setFields(
        {
            name: "Failed:",
            value: "Someone already has that username"
        }
    )
    .setFooter({text: "Your goofy ahh knows that ain't your name"})
    .setColor("Red")