"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisunderstoodButtonEmbed = void 0;
const discord_js_1 = require("discord.js");
class MisunderstoodButtonEmbed extends discord_js_1.EmbedBuilder {
    constructor(buttonId) {
        super();
        this.setColor("Orange");
        this.setTitle("I don't understand...");
        this.setFields({
            "name": "Notice:",
            "value": "I don't know what to do with this button. Try creating a new one eh?"
        });
        this.setFooter({ text: `Id: ${buttonId}` });
    }
}
exports.MisunderstoodButtonEmbed = MisunderstoodButtonEmbed;
//# sourceMappingURL=InteractionCreateEmbeds.js.map