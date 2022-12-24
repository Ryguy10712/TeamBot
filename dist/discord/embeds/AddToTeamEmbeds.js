"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRemoveSuccess = exports.PlayerAddSuccess = void 0;
const discord_js_1 = require("discord.js");
class PlayerAddSuccess extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Green");
        this.setFields({
            name: "Success",
            value: "The player has been added to your team"
        });
    }
}
exports.PlayerAddSuccess = PlayerAddSuccess;
class PlayerRemoveSuccess extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Green");
        this.setFields({
            name: "Success:",
            value: "The player has been removed from your team"
        });
    }
}
exports.PlayerRemoveSuccess = PlayerRemoveSuccess;
//# sourceMappingURL=AddToTeamEmbeds.js.map