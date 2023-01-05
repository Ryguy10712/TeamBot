import { Client, CommandInteraction, CacheType, SlashCommandStringOption } from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import PCLPlayer from "../../interfaces/PCLPlayer";
import * as Embeds from "../embeds/RegisterEmbeds";
import { isoculusidClean } from "../../utils/StringSanatizers";
import { TeamBot } from "../../Bot";

export default class RegisterCommand extends DiscordCommand {
    public inDev: boolean = false;
    constructor() {
        super();
        this.properties
            .setName("register")
            .setDescription("registers your oculus username")
            .addStringOption(new SlashCommandStringOption().setName("oculusid").setDescription("your oculus username in exact casing").setRequired(true));
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const optionResponse = interaction.options.get("oculusid")?.value as string;

        if (!isoculusidClean(optionResponse)) {
            return interaction.reply({ embeds: [Embeds.InvalidIdError], ephemeral: true });
        }

        if (interaction.options.get("oculusid")?.value) {
            const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
            const PCLPLayer = registeredPlayers.find((PCLPlayer) => {
                return PCLPlayer.discordID === interaction.user.id;
            });

            const existingPlayer = await teamBot.prisma.player.findFirst({where: {oculusId: optionResponse}})

            if(existingPlayer) {
                if(existingPlayer.oculusId == optionResponse){
                    interaction.reply({embeds: [Embeds.IdMatchError], ephemeral: true})
                }
                else{
                    interaction.reply({embeds: [Embeds.UserNameExistsError], ephemeral: true})
                }
                return;
            }

            await teamBot.prisma.player.upsert({
                where: {discordId: interaction.user.id},
                create:{
                    discordId: interaction.user.id,
                    oculusId: optionResponse,
                    isCaptain: false,
                    isCoCap: false,
                    teamId: undefined,
                    team: undefined
                },
                update : {oculusId: optionResponse}
            })
            teamBot.prisma.$disconnect()
            interaction.reply({embeds: [new Embeds.RegisterSuccess(optionResponse)], ephemeral: true})

            
        }
    }
}
