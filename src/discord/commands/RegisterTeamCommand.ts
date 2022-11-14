import { Client, CommandInteraction, CacheType, SlashCommandMentionableOption, SlashCommandStringOption, Message } from "discord.js";
import { PCLTeam, Ranks } from "../../interfaces/PCLTeam";
import PCLPlayer from "../../interfaces/PCLPlayer";
import fs from "fs";
import { DiscordCommand } from "../DiscordCommand";
import { TeamBot } from "../../Bot";

export default class RegisterTeamCommand extends DiscordCommand {
    public inDev: boolean = true;

    constructor() {
        super();
        this.properties
            .setName("register_team")
            .setDescription("adds your team to the database")
            .addMentionableOption(new SlashCommandMentionableOption().setName("cocap_discord").setDescription("the co-captain of your team"))
            .addStringOption(new SlashCommandStringOption().setName("cocap_oculus").setDescription("use co_cap discord if you can"))
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("rank")
                    .setDescription("leave blank if you are unranked")
                    .setChoices({ name: "Gold", value: "Gold" }, { name: "Silver", value: "Silver" }, { name: "Bronze", value: "Bronze" })
            );
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const discordResponse = interaction.options.get("cocap_discord")?.value as string;
        const stringResponse = interaction.options.get("cocap_oculus")?.value as string;
        const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
        const player = registeredPlayers.find((PCLPlayer) => {
            return PCLPlayer.discordID === interaction.user.id;
        });
        let cocap: PCLPlayer;

        //terminate if user isn't registered
        if (!player) return interaction.reply("You are not registered");

        if (discordResponse) {
            cocap = teamBot.findPCLPlayerByDiscord(discordResponse)!;
        } else if (stringResponse) {
            cocap = teamBot.findPCLPlayerByOculus(stringResponse)!;
        }

        let team: PCLTeam = {
            captain: player,
            coCap: cocap!,
            players: [player],
            rank: undefined,
            guildID: undefined,
            isWeeklySchedulingPollsEnabled: undefined,
        };
        //determine team rank
        switch (interaction.options.get("rank")?.value) {
            case "Gold":
                team.rank = Ranks.GOLD;
                break;
            case "Silver":
                team.rank = Ranks.SILVER;
                break;
            case "Bronze":
                team.rank = Ranks.BRONZE;
        }
        //determine team guild
        await interaction.reply("Is this your team's main server?")
        const filter = (response: Message) => {
            return interaction.user.id == response.member?.id
        }
        let collected = await interaction.channel?.awaitMessages({max: 1, time: 15000, errors: ['time'], filter: filter}).catch(e => {})
        
        

    }
}
