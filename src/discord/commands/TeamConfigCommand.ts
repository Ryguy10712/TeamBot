import { Client, CommandInteraction, CacheType, SelectMenuInteraction, ComponentType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import * as Embeds from "../embeds/TeamConfigEmbeds";
import * as Components from "../components/TeamConfigComponents";

export default class TeamConfigCommand extends DiscordCommand {
    public inDev: boolean = true;

    constructor() {
        super();
        this.properties.setName("team_config").setDescription("Edit various team preferences");
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        //terminate if player is not registerd
        if (!teamBot.findPCLPlayerByDiscord(interaction.user.id)) return interaction.reply({ embeds: [Embeds.NotRegisteredError] });
        if (!teamBot.findTeamByCoCap(interaction.user.id)) return interaction.reply({ embeds: [Embeds.NoTeamError] });

        const reply = await interaction.reply({ components: [new Components.TeamConfigRow(0), Components.AddPlayerButton], embeds: [Embeds.AddPlayerEmbed] });
        const filter = (i: SelectMenuInteraction) => {
            if (i.deferred || i.customId != "teamcfgMenu") return false;
            i.deferUpdate();
            return i.user == interaction.user;
        };
        const collector = reply.createMessageComponentCollector({ filter: filter, componentType: ComponentType.StringSelect, time: 5000 });
        collector.on("collect", (menuInteraction) => {
            switch (menuInteraction.values[0]) {
                case "addPlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(0), Components.RemovePlayerButton], embeds: [Embeds.AddPlayerEmbed] });
                    break;
                case "removePlayer":
                    interaction.editReply({ components: [new Components.TeamConfigRow(1), Components.RemovePlayerButton], embeds: [Embeds.RemovePlayerEmbed] });
                    break;
                case "editName":
                    interaction.editReply({ components: [new Components.TeamConfigRow(2), Components.EditButton], embeds: [Embeds.EditNameEmbed] });
                    break;
                case "confidential":
                    interaction.editReply({
                        components: [new Components.TeamConfigRow(3), Components.ConfidentialityButtons],
                        embeds: [Embeds.ConfidentialityEmbed],
                    });
                    break;
            }
        });
        collector.on("end", async () => {
            if (collector.endReason != "time") return;
            interaction.followUp("Timed out");
        });
    }
}
