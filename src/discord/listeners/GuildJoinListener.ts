import { ChannelType, Collection, GuildTextBasedChannel, Message, PermissionResolvable } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordListener } from "../DiscordListener";
import { MissingPermissionsEmbed } from "../embeds/GuildJoinEmbeds";

export class GuildJoinListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("guildCreate", async (guild) => {
            //check if the bot has the proper permissions\
            
            const me = await guild.members.fetchMe()
            const currentPerms = me.permissions
            const neededPerms: PermissionResolvable[] = ["AddReactions", "SendMessages", "ManageMessages", "EmbedLinks", "UseExternalEmojis", "UseExternalStickers"];
            const missingPerms: PermissionResolvable[] = [];
            for(const perm of neededPerms){
                if(!currentPerms.has(perm)){
                    missingPerms.push(perm)
                }
            }
            if(missingPerms.length === 0) return; //bot has all the right perms
            //look for a channel the bot can send messages in
            teamBot.log(`Joined guild ${guild.name} with the wrong perms`, false)
            const notifyChans = (await guild.channels.fetch()).filter(channel => {
                if(!channel) return false;
                return channel.type == ChannelType.GuildText
            }) as Collection<string, GuildTextBasedChannel>

            const owner = await guild.fetchOwner()
            let msg = null
            if(!notifyChans) { //send the guild owner a dm
                owner.send({embeds: [new MissingPermissionsEmbed(missingPerms)]})
            } else {
                for(const channel of notifyChans){
                    msg = await channel[1].send({embeds: [new MissingPermissionsEmbed(missingPerms)]}).catch(() => {return}) as Message
                    if(msg) break;
                }
                if(!msg){
                    owner.send({embeds: [new MissingPermissionsEmbed(missingPerms)]})
                }
            }
            
        });
    }
}
