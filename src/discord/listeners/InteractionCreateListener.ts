import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    teamBot.commands.get(interaction.commandName)?.executeInteraction(teamBot.client, interaction, teamBot);
                }
            } catch (e) {
                console.error(e);
            }

            if (interaction.isButton()) {
                if (interaction.customId.startsWith("schedreq")) {
                    if (interaction.customId.includes("Accept")) {
                        interaction.deferUpdate();
                        const poo = await import("../../events/ScheduleRequestAccept");
                        poo.HandleScheduleRequestAccept(teamBot, interaction);
                    } else if (interaction.customId.includes("Deny")) {
                        interaction.deferUpdate();
                    }
                } else if (interaction.customId.startsWith("matchOrganizer")) {
                    if (interaction.customId.includes("Update")) {
                        interaction.deferUpdate()
                        const MatchOrganizerUpdate = await import("../../events/MatchOrganizerUpdate")
                        MatchOrganizerUpdate.execute(teamBot, interaction)
                    }
                }
            }
        });
    }
}
