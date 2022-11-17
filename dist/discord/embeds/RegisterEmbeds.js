"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNameExistsError = exports.IdMatchError = exports.InvalidIdError = exports.UpdateSuccess = exports.RegisterSuccess = void 0;
const discord_js_1 = require("discord.js");
exports.RegisterSuccess = new discord_js_1.EmbedBuilder()
    .setTitle("Nice to meet ya!")
    .setFooter({ text: "You can always change your username by registering again!" })
    .setColor("Green");
exports.UpdateSuccess = new discord_js_1.EmbedBuilder()
    .setTitle("Updated!")
    .setColor("Green");
exports.InvalidIdError = new discord_js_1.EmbedBuilder()
    .setTitle("That's not your name...")
    .setFields({
    name: "Failed:",
    value: "Oculus usernames must be 3-15 characters, and can only contain letters, numbers, periods, and underscores",
})
    .setColor("Red");
exports.IdMatchError = new discord_js_1.EmbedBuilder()
    .setTitle("We've met before...")
    .setColor("Orange")
    .setFooter({ "text": "Bro fr forgot their own name 💀" });
exports.UserNameExistsError = new discord_js_1.EmbedBuilder()
    .setTitle("How original...")
    .setFields({
    name: "Failed:",
    value: "Someone already has that username"
})
    .setFooter({ text: "Your goofy ahh knows that ain't your name" })
    .setColor("Red");
//# sourceMappingURL=RegisterEmbeds.js.map