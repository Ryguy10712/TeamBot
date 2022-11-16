import { Client, CommandInteraction, CacheType, SlashCommandStringOption, ActionRowBuilder } from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import fs from "fs";
import PCLPlayer from "../../interfaces/PCLPlayer";

export default class RegisterCommand extends DiscordCommand {
    public inDev: boolean = true;
    constructor() {
        super();
        this.properties
            .setName("register")
            .setDescription("registers player and/or team")
            .addStringOption(new SlashCommandStringOption().setName("oculusid").setDescription("your oculus username in exact casing").setRequired(true)); 
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>) {
        const optionResponse = interaction.options.get("oculusid")?.value as string;

        if (optionResponse.includes(" ")) {
            return interaction.reply("Invalid Username: Oculus usernames cannot have spaces.");
        }

        if (interaction.options.get("oculusid")?.value) {
            const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
            const PCLPLayer = registeredPlayers.find((PCLPlayer) => {
                return PCLPlayer.discordID === interaction.user.id;
            });

            if (PCLPLayer) {
                //at this point, the user has registered their discord
                const index = registeredPlayers.indexOf(PCLPLayer);

                if (PCLPLayer.oculusId != optionResponse) {
                    //user is already registered, but has changed oculus username
                    registeredPlayers[index].oculusId = optionResponse;
                    fs.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                    await interaction.reply("Your oculus username has been updated successfully");
                } else {
                    //registered user re-registered with the same oculusid
                    await interaction.reply("No need to re-register, you are already registered as " + optionResponse);
                }
            } else {
                //at this point, the user has not registered their discord
                registeredPlayers.push({
                    discordID: interaction.user.id,
                    oculusId: optionResponse,
                    isCaptain: undefined,
                    isCoCap: undefined,
                    team: undefined,
                    isBotAdmin: undefined,
                });
                fs.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
                await interaction.reply("Sucessfully registered");
            }
        }
    }
}
