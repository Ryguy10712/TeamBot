"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTeamEmbed = exports.WrongChannelTypeEmbed = exports.SchedChanSetEmbed = void 0;
const discord_js_1 = require("discord.js");
class SchedChanSetEmbed extends discord_js_1.EmbedBuilder {
    constructor(schedChanId) {
        super();
        this.setTitle("You got it!");
        this.setColor("Green");
        this.setFields({
            name: "Success:",
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
            name: "Failed:",
            value: "Use an actual text-based server channel please"
        });
    }
}
exports.WrongChannelTypeEmbed = WrongChannelTypeEmbed;
class NoTeamEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setTitle("Getting ahead of yourself, eh?");
        this.setColor("Red");
        this.setFields({
            name: "Failed:",
            value: "You must create a team before you can set a scheduling channel"
        });
        this.setFooter({ text: "stupid" });
    }
}
exports.NoTeamEmbed = NoTeamEmbed;
//# sourceMappingURL=SchedChannelEmbeds.js.map