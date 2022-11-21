"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamNameMatchError = exports.CoCapNotRegisteredError = exports.NotTeamGuildError = exports.NotRegisteredError = exports.CoCapOccuipiedError = exports.AlreadyCaptainError = exports.TeamCreateSuccess = exports.GuildConfirmationEmbed = void 0;
const discord_js_1 = require("discord.js");
exports.GuildConfirmationEmbed = new discord_js_1.EmbedBuilder()
    .setTitle("Is this your team's main server?")
    .setDescription("My features will only work correctly is this is the server where you organize your matches.")
    .setFooter({ text: "You can always change this later with /team_config!" })
    .setColor("Yellow");
exports.TeamCreateSuccess = new discord_js_1.EmbedBuilder()
    .setTitle("Your team has been created!")
    .setDescription("Your team will be verified shortly")
    .setDescription("If any of this information is incorrect, change it immediateley with /team_config or you risk losing permission to run this command")
    .setColor("Green");
exports.AlreadyCaptainError = new discord_js_1.EmbedBuilder()
    .setTitle("Heads Up!")
    .setColor("Red")
    .setFields({
    name: "Failed:",
    value: "You cannot be the captain or co-captain of multiple teams at once"
});
exports.CoCapOccuipiedError = new discord_js_1.EmbedBuilder()
    .setTitle("Heads Up!")
    .setColor("Red")
    .setFields({
    name: "Failed:",
    value: "Your co-captain is already a captain or co-captain of another team"
});
exports.NotRegisteredError = new discord_js_1.EmbedBuilder()
    .setTitle("You are not registered!")
    .setDescription("You cannot run this command until you are registered.")
    .setFooter({ text: "Proceed with this command once you are registered" })
    .setColor("Red");
exports.NotTeamGuildError = new discord_js_1.EmbedBuilder()
    .setTitle("Let's run this elsewhere...")
    .setDescription("This command must be ran in your team's guild so I can work properly")
    .setColor("Red");
exports.CoCapNotRegisteredError = new discord_js_1.EmbedBuilder()
    .setTitle("Slow down...")
    .addFields({
    name: "Error:",
    value: "Your Co-Captain is not registered.",
})
    .setFooter({ text: "Proceed once they are registered, or add them later." })
    .setColor("Red");
exports.TeamNameMatchError = new discord_js_1.EmbedBuilder()
    .setTitle("Try to be a little bit more original...")
    .addFields({
    name: "Failed:",
    value: "A team with that name already exists. If you believe someone is trying to impersonate your team, contact Ryguy to have it resolved"
})
    .setColor("Red");
//# sourceMappingURL=RegisterTeamEmbeds.js.map