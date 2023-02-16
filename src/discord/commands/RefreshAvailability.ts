import { PrismaClient, TeamPlayer } from "@prisma/client";
import { Client, CommandInteraction, CacheType, GuildTextBasedChannel, MessageReaction, User } from "discord.js";
import { TeamBot } from "../../Bot";
import { DayOfWeek, time, availability } from "../../types";
import { DiscordCommand } from "../DiscordCommand";
import { UserNotCaptainOrEmbed } from "../embeds/CommonEmbeds";

export class RefreshAvailabilityCommand extends DiscordCommand {
    public inDev: boolean;
    private reactionToTime: {[yes: string]: time}

    constructor() {
        super();
        this.inDev = true;
        this.properties.setName("fix_availability");
        this.properties.setDescription("only use this if availability appears incorrect");

        this.reactionToTime = {
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
        }
    }

    private async filterTeamUsers(users: IterableIterator<User>, teamPlayers: TeamPlayer[]) {
        const filteredPlayers: TeamPlayer[] = []
        for (const user of users){
            const teamPlayer = teamPlayers.find(player => {
                return player.playerId == user.id
            })
            if(teamPlayer){
                filteredPlayers.push(teamPlayer)
            }
        }
        return filteredPlayers
    }

    private async fixReactionInfo(reaction: MessageReaction, filteredUsers: TeamPlayer[], prisma: PrismaClient) {
        const timeOfEmoji = this.reactionToTime[reaction.emoji.name!]
        const day = reaction.message.content?.toLowerCase() as DayOfWeek
        for (const user of filteredUsers) {
            let dayInfo = user[day] ? user[day] as availability : {}
            if(!dayInfo[timeOfEmoji]){
                dayInfo[timeOfEmoji] = true
                prisma.teamPlayer.update({
                    where: {playerId: user.playerId},
                    data: {[day]: dayInfo}
                }).then(() => {prisma.$disconnect()})
            }
        }
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        if(!teamBot.isAdmin(interaction.user.id)) {
            interaction.reply({ephemeral: true, content: "This command is not ready yet"})
            return;
        }
        interaction.deferReply({ephemeral: true})
        const daysOfWeek: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const issuer = await teamBot.prisma.teamPlayer.findFirst({
            where: { playerId: interaction.user.id, OR: [{ isCaptain: true }, { isCoCap: true }] },
            include: { team: { include: { availability: true, players: true }, } },
        });
        if (!issuer) {
            interaction.followUp({ embeds: [new UserNotCaptainOrEmbed()], ephemeral: true });
            return;
        }
        if (!issuer.team.schedulingChannel) {
            interaction.followUp({ content: "You must have a scheduling channel to run this command", ephemeral: true });
            return;
        }

        const schedulingChannel = (await teamBot.client.channels.fetch(issuer.team.schedulingChannel)) as GuildTextBasedChannel;
        const availability = issuer.team.availability!

        for (const day of daysOfWeek) {
            const msg = await schedulingChannel.messages.fetch(availability[day]);
            const reactions = msg.reactions.valueOf().values()
            
            for (const reaction of reactions){
                const users = (await reaction.users.fetch()).values()
                const filteredUsers = await this.filterTeamUsers(users, issuer.team.players)
                this.fixReactionInfo(reaction, filteredUsers, teamBot.prisma);
            }
        }
        interaction.followUp({content: "Success", ephemeral: true})
    }
}
