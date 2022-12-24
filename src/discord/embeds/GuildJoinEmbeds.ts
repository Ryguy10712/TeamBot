import { EmbedBuilder, PermissionResolvable } from "discord.js";
type NeededPerm = "ManageMessages" | "SendMessages" | "AddReactions" | "EmbedLinks" | "UseExternalEmojis" | "UseExternalStickers"

export class MissingPermissionsEmbed extends EmbedBuilder {
    constructor(missingPerms: PermissionResolvable[]){
        super()
        this.setColor("Orange")
        this.setTitle("Hold up!")
        this.setDescription("I am missing the proper permissions in order to work properly. Here's a list of the required ones")
        this.setFooter({text: "I have left the server, please reinvite me with the proper perms"})
        
        for(const perm of missingPerms){
            
            this.addFields({
                name: `-${perm.toString()}`,
                value: "Status: Not permitted"
            })
        }

    }

}