"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongChannelTypeEmbed = exports.SchedChanSetEmbed = void 0;
const discord_js_1 = require("discord.js");
class SchedChanSetEmbed extends discord_js_1.EmbedBuilder {
    constructor(schedChanId) {
        super();
        this.setTitle("You got it!");
        this.setColor("Green");
        this.setFields({
            name: "Success",
            value: `<#${schedChanId}> is now your scheduling channel`
        });
    }
}
exports.SchedChanSetEmbed = SchedChanSetEmbed;
class WrongChannelTypeEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setTitle("A misclick eh?");
        this.setColor("Red");
        this.setFields({
            name: "Failed",
            value: "Use an actual text-based server channel please"
        });
    }
}
exports.WrongChannelTypeEmbed = WrongChannelTypeEmbed;
//# sourceMappingURL=SchedChannelEmbeds.js.map