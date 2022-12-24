"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingPermissionsEmbed = void 0;
const discord_js_1 = require("discord.js");
class MissingPermissionsEmbed extends discord_js_1.EmbedBuilder {
    constructor(missingPerms) {
        super();
        this.setColor("Orange");
        this.setTitle("Hold up!");
        this.setDescription("I am missing the proper permissions in order to work properly. Here's a list of the required ones");
        this.setFooter({ text: "I have left the server, please reinvite me with the proper perms" });
        for (const perm of missingPerms) {
            this.addFields({
                name: `-${perm.toString()}`,
                value: "Status: Not permitted"
            });
        }
    }
}
exports.MissingPermissionsEmbed = MissingPermissionsEmbed;
//# sourceMappingURL=GuildJoinEmbeds.js.map