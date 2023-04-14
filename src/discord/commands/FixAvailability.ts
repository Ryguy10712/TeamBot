import { Team, TeamAvailability, TeamPlayer } from "@prisma/client";
import { AutocompleteInteraction, CacheType, Client, CommandInteraction, DiscordAPIError, GuildTextBasedChannel, SlashCommandStringOption } from "discord.js";
import { TeamBot } from "../../Bot";
import { availability, DayOfWeek } from "../../types";
import { DiscordCommand } from "../DiscordCommand";
import { HourReaction } from "../../types";
import { NoSchedulingChannelEmbed } from "../embeds/CommonEmbeds";

export class FixAvailabilityCommand extends DiscordCommand {
    public inDev: boolean;
    constructor(){
        super()
        this.inDev = false;
        this.properties
        .setName("fix_availability")
        .setDescription("fixes availability if it doesn't seem right")

        const teamOption = new SlashCommandStringOption()
        .setName("team")
        .setDescription("admins only")
        .setAutocomplete(true)

        this.properties.addStringOption(teamOption)
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        await interaction.deferReply({ephemeral: true})
        const team = interaction.options.get("team")?.value as string
        
        let teamForFix: Team & {availability: TeamAvailability | null, players: TeamPlayer[]} | null
        if(team){
            if(!teamBot.isAdmin(interaction.user.id)){
                interaction.followUp({content: "You are not allowed to use the team option", ephemeral: true})
            }

            if(isNaN(parseInt(team))){
                interaction.followUp({content: "this team does not exist", ephemeral: true})
                return;
            }

            teamForFix = await teamBot.prisma.team.findFirst({
                where: {id: parseInt(team)},
                include: {availability: true, players: true},
            })
        } else {
            teamForFix = await teamBot.prisma.team.findFirst({
                where: {players: {some: {playerId: interaction.user.id}}},
                include: {availability: true, players: true}
            })
        }
        if(!teamForFix?.schedulingChannel){
            interaction.followUp({embeds: [new NoSchedulingChannelEmbed()], ephemeral: true})
            return;
        }
        if(!teamForFix.availability){
            interaction.followUp({content: "That team has no availability", ephemeral: true})
            return;
        }

        const daysOfWeek: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        const validReactions: validReaction[] = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"]
        type validReaction = "1️⃣" | "2️⃣" | "3️⃣" | "4️⃣" | "5️⃣" | "6️⃣" | "7️⃣" | "8️⃣" | "9️⃣" | "🔟" | "🕚" | "🕛";
        const reactionToTime = {
            "1️⃣": "one",
            "2️⃣": "two",
            "3️⃣": "three",
            "4️⃣": "four",
            "5️⃣": "five",
            "6️⃣": "six",
            "7️⃣": "seven",
            "8️⃣": "eight",
            "9️⃣": "nine",
            "🔟": "ten",
            "🕚": "eleven",
            "🕛": "twelve",
        };

        for(const day of daysOfWeek){
            const schedChan = await client.channels.fetch(teamForFix.schedulingChannel)
            .catch(e => {
                if(e instanceof DiscordAPIError && e.code == 50001){
                    interaction.followUp("missing access")
                    return;
                }
            }) as GuildTextBasedChannel | null
            if(!schedChan){
                return;
            }
            const msgID = teamForFix.availability[day]
            const msg = await schedChan.messages.fetch(msgID)
            const teamPlayers = teamForFix.players
            const playerToAvail = teamPlayers.map((player) => ({id: player.playerId, availability: {}}))

            for(const emoji of validReactions){
                const msgReaction = msg.reactions.cache.get(emoji)
                if(msgReaction && msgReaction.count > 1){
                    const users = await msg.reactions.cache.get(emoji)?.users.fetch()!
                    const userIds = users.keys()
                    for(const id of userIds){
                        if(playerToAvail.some(obj => {return obj.id == id})){
                            Object.assign(
                                playerToAvail.find(obj => {return obj.id == id})!.availability,
                                {[reactionToTime[emoji]]: true}
                            )
                        }
                    }
                }
            }
            for(const obj of playerToAvail){
                teamBot.prisma.teamPlayer.update({
                    where: {playerId: obj.id},
                    data: {
                        [day]: obj.availability
                    }
                })
                .then(() => {teamBot.prisma.$disconnect()})
            }

            
        }
        interaction.followUp({content: "Done", ephemeral: true})
    }

    override async handleAutoComplete(i: AutocompleteInteraction, teamBot: TeamBot): Promise<boolean> {

        const teams = await teamBot.prisma.team.findMany({
            where: {name: {startsWith: i.options.data[0].value as string}}
        });
        
        const filtered = teams.map(team => ({name: team.name, value: team.id.toString()}))
        i.respond(filtered)
        return true;
    }
}