import { ChannelType, GuildTextBasedChannel, PermissionResolvable, PermissionsBitField } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordListener } from "../DiscordListener";
import { MissingPermissionsEmbed } from "../embeds/GuildJoinEmbeds";

export class GuildJoinListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("guildCreate", async (guild) => {
            //check if the bot has the proper permissions\
            
            const currentPerms = (await guild.members.fetchMe()).permissions
            const neededPerms = [PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks];
            const missingPerms: any = [];
            for(const perm of neededPerms){
                if(!currentPerms.has(perm)){
                    missingPerms.push(perm)
                }
            }
            if(missingPerms.length === 0) return; //bot has all the right perms
            //look for a channel the bot can send messages in
            
            const chan = guild.channels.cache.find(channel => {return channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me!).has("SendMessages")}) as GuildTextBasedChannel
            if(!chan){
                //dm the owner if the bot cannot send any messages
                await (await guild.fetchOwner()).send({embeds: [new MissingPermissionsEmbed(missingPerms)]})
                guild.leave()
                return;
            }
            //channel exists
            try{
                await chan.send({embeds: [new MissingPermissionsEmbed(missingPerms)]});
            } catch {
                (await guild.fetchOwner()).send({embeds: [new MissingPermissionsEmbed(missingPerms)]})
            }
            guild.leave();
        });
    }
}
