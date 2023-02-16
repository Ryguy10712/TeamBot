import { Client, CommandInteraction, CacheType, SlashCommandStringOption } from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import * as Embeds from "../embeds/RegisterEmbeds";
import { isoculusidClean } from "../../utils/StringSanatizers";
import { TeamBot } from "../../Bot";
import { Player } from "@prisma/client";

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

            const existingPlayer = await teamBot.prisma.player.findFirst({where: {oculusId: optionResponse}}).then(() => {teamBot.prisma.$disconnect()}) as Player

            if(existingPlayer) {
                if(existingPlayer.oculusId == optionResponse){
                    interaction.reply({embeds: [Embeds.IdMatchError], ephemeral: true})
                }
                else{
                    interaction.reply({embeds: [Embeds.UserNameExistsError], ephemeral: true})
                }
                return;
            }

            teamBot.prisma.player.upsert({
                where: {discordId: interaction.user.id},
                update: {oculusId: optionResponse},
                create: {
                    discordId: interaction.user.id,
                    oculusId: optionResponse
                },
            }).then(() => {
                interaction.reply({embeds: [new Embeds.RegisterSuccess(optionResponse)], ephemeral: true})
                teamBot.prisma.$disconnect()
            }).catch((e) => {
                teamBot.log(e, true)
                interaction.reply("An unexpected error has occured")
                teamBot.prisma.$disconnect()
            })
            
        
            
            
        }
    }

