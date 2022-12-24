"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerNotOnUserTeamEmbed = exports.PlayerAlreadyOnEmbed = exports.UserNotOnTeamEmbed = exports.PlayerNotRegisteredEmbed = exports.UserNotCaptainEmbed = void 0;
const discord_js_1 = require("discord.js");
class UserNotCaptainEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Red");
        this.setTitle("A bit awkward eh?");
        this.setFields({
            name: "Failed:",
            value: "Only captains or co-captains can use this"
        });
    }
}
exports.UserNotCaptainEmbed = UserNotCaptainEmbed;
class PlayerNotRegisteredEmbed extends discord_js_1.EmbedBuilder {
    constructor(oculusId) {
        super();
        this.setColor("Red");
        this.setTitle("What a loser...");
        if (!oculusId) {
            this.setFields({
                name: "Failed:",
                value: "The provided player is not registered"
            });
        }
        else {
            this.setFields({
                name: "Failed",
                value: `**${oculusId}** could not be found. Check spelling or wait for them to register`
            });
        }
    }
}
exports.PlayerNotRegisteredEmbed = PlayerNotRegisteredEmbed;
class UserNotOnTeamEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Red");
        this.setTitle("Wait a second...");
        this.setFields({
            name: "Failed:",
            value: "You must be on a team to use this command"
        });
    }
}
exports.UserNotOnTeamEmbed = UserNotOnTeamEmbed;
class PlayerAlreadyOnEmbed extends discord_js_1.EmbedBuilder {
    constructor(oculusId) {
        super();
        this.setColor("Red");
        this.setTitle("No can do...");
        if (oculusId) {
            this.setFields({
                name: "Failed:",
                value: `${oculusId} is already on a team`
            });
        }
        else {
            this.setFields({
                name: "Failed:",
                value: "The player is already on a team"
            });
        }
    }
}
exports.PlayerAlreadyOnEmbed = PlayerAlreadyOnEmbed;
class PlayerNotOnUserTeamEmbed extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
        this.setColor("Red");
        this.setTitle("Can't do that");
        this.setFields({
            name: "Failed:",
            value: "That player is not on your team"
        });
    }
}
exports.PlayerNotOnUserTeamEmbed = PlayerNotOnUserTeamEmbed;
//# sourceMappingURL=CommonEmbeds.js.map