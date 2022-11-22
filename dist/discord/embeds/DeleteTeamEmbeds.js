"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Success = exports.NotCaptainError = void 0;
const discord_js_1 = require("discord.js");
exports.NotCaptainError = new discord_js_1.EmbedBuilder().setColor("Red").setTitle("What...").setFields({
    name: "Failed:",
    value: "You are not the captain of a team."
});
exports.Success = new discord_js_1.EmbedBuilder().setColor("Green").setTitle("Gone...").setFields({
    name: "Success:",
    value: "Your team has been deleted."
});
//# sourceMappingURL=DeleteTeamEmbeds.js.map