import { Client, CommandInteraction, CacheType, SlashCommandStringOption } from "discord.js";
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
            .addStringOption(new SlashCommandStringOption().setName("oculusid").setDescription("your oculus username in exact casing"));
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>) {
        const optionResponse = interaction.options.get("oculusid")?.value as string;

        if (interaction.options.get("oculusid")?.value) {
            const registeredPlayers: PCLPlayer[] = JSON.parse(fs.readFileSync("./db/registeredPlayers.json", "utf-8"));
            const PCLPLayer = registeredPlayers.find((PCLPlayer) => {
                return PCLPlayer.discordID === interaction.user.id;
            });

            if (PCLPLayer) {
                //at this point, the user has registered their discord
                const index = registeredPlayers.indexOf(PCLPLayer)
                await interaction.reply("You have been found in the DB");

                if (PCLPLayer.oculusId != optionResponse) {
                    //user is already registered, but has changed oculus username
                    interaction.followUp("Changing oculus username");
                    registeredPlayers[index].oculusId = optionResponse;
                    fs.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers))
                }
            } else {
                //at this point, the user has not registered their discord
                interaction.reply("not found in the db, adding");
                registeredPlayers.push({ discordID: interaction.user.id, oculusId: optionResponse, isCaptain: undefined, isCoCap: undefined, team: undefined });
                fs.writeFileSync("./db/registeredPlayers.json", JSON.stringify(registeredPlayers));
            }
        }
    }
}
