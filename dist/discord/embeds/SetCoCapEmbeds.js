"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoCapSetEmbed = void 0;
const discord_js_1 = require("discord.js");
class CoCapSetEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Green");
        this.setFields({
            name: "Success:",
            value: "The player has been set as your co-captain"
        });
    }
}
exports.CoCapSetEmbed = CoCapSetEmbed;
//# sourceMappingURL=SetCoCapEmbeds.js.map