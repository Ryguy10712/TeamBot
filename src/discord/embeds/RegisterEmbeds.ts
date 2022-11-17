import { EmbedBuilder } from "discord.js";

//SUCCCESS
export let RegisterSuccess = new EmbedBuilder()
    .setTitle("Nice to meet ya!")
    //fields set during runtime
    .setFooter({ text: "You can always change your username by registering again!" })
    .setColor("Green");

export let UpdateSuccess = new EmbedBuilder()
    .setTitle("Updated!")
    //fields set during runtime
    .setColor("Green")

//ERROR
export const InvalidIdError = new EmbedBuilder()
    .setTitle("That's not your name...")
    .setFields({
        name: "Failed:",
        value: "Oculus usernames can only contain numbers, letters, periods, and underscores",
    })
    .setColor("Red");

export const IdMatchError = new EmbedBuilder()
    .setTitle("We've met before...")
    //fields set during runtime
    .setColor("Orange")
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