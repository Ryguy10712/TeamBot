"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildJoinListener = void 0;
const discord_js_1 = require("discord.js");
const DiscordListener_1 = require("../DiscordListener");
const GuildJoinEmbeds_1 = require("../embeds/GuildJoinEmbeds");
class GuildJoinListener extends DiscordListener_1.DiscordListener {
    startListener(teamBot) {
        teamBot.client.on("guildCreate", async (guild) => {
            const currentPerms = (await guild.members.fetchMe()).permissions;
            const neededPerms = [discord_js_1.PermissionsBitField.Flags.AddReactions, discord_js_1.PermissionsBitField.Flags.SendMessages, discord_js_1.PermissionsBitField.Flags.UseExternalEmojis, discord_js_1.PermissionsBitField.Flags.UseExternalStickers, discord_js_1.PermissionsBitField.Flags.ManageMessages, discord_js_1.PermissionsBitField.Flags.EmbedLinks];
            const missingPerms = [];
            for (const perm of neededPerms) {
                if (!currentPerms.has(perm)) {
                    missingPerms.push(perm);
                }
            }
            if (missingPerms.length === 0)
                return;
            const chan = guild.channels.cache.find(channel => { return channel.type === discord_js_1.ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SendMessages"); });
            if (!chan) {
                await (await guild.fetchOwner()).send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] });
                guild.leave();
                return;
            }
            try {
                await chan.send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] });
            }
            catch {
                (await guild.fetchOwner()).send({ embeds: [new GuildJoinEmbeds_1.MissingPermissionsEmbed(missingPerms)] });
            }
            guild.leave();
        });
    }
}
exports.GuildJoinListener = GuildJoinListener;
//# sourceMappingURL=GuildJoinListener.js.map