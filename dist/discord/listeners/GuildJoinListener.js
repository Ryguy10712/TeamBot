"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildJoinListener = void 0;
const discord_js_1 = require("discord.js");
const DiscordListener_1 = require("../DiscordListener");
const GuildJoinEmbeds_1 = require("../embeds/GuildJoinEmbeds");
class GuildJoinListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("guildCreate", async (guild) => {
            const me = await guild.members.fetchMe();
            const currentPerms = me.permissions;
            const neededPerms = ["AddReactions", "SendMessages", "ManageMessages", "EmbedLinks", "UseExternalEmojis", "UseExternalStickers"];
            const missingPerms = [];
            for (const perm of neededPerms) {
                if (!currentPerms.has(perm)) {
                    missingPerms.push(perm);
                }
            }
            if (missingPerms.length === 0)
                return;
            const notifyChans = (await guild.channels.fetch()).filter(channel => {
                if (!channel)
                    return false;
                return channel.type == discord_js_1.ChannelType.GuildText;
            });
            const owner = await guild.fetchOwner();
            let msg = null;
            if (!notifyChans) {
                owner.send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] });
            }
            else {
                for (const channel of notifyChans) {
                    msg = await channel[1].send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] }).catch(() => { return; });
                    if (msg)
                        break;
                }
                if (!msg) {
                    owner.send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] });
                }
            }
        });
    }
}
exports.GuildJoinListener = GuildJoinListener;
//# sourceMappingURL=GuildJoinListener.js.map