import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";
import fs from "fs";
import { MatchOrganizerUpdateButton } from "../buttons/OrganizerUpdate";
import { MisunderstoodButtonEmbed } from "../embeds/InteractionCreateEmbeds";
import { DiscordCommand } from "../DiscordCommand";
import { DiscordContextMenu } from "../DiscordContextMenu";

export class InteractionCreateListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        //SPECIAL CASES
        const nonReplyButtonIds = ["teamcfgGold", "teamcfgSilver", "teamcfgBronze", "teamcfgTrue", "teamcfgFalse"];
        const nonDeferUpdateIds = ["teamcfgAdd", "teamcfgRemove", "teamcfgEdit", "teamcfgCoCap"];
        //get buttons in case of crash and/or restart, and add them to non-replies
        const buttonCache: string[] = JSON.parse(fs.readFileSync("./cache/persistentButtons.json", "utf-8"));
        //sort the different kinds of buttons
        for (const buttonId of buttonCache) {
            if (buttonId.startsWith("matchOrganizerUpdate")) {
                const btn = new MatchOrganizerUpdateButton(parseInt(buttonId.replace("matchOrganizerUpdate", "")));
                teamBot.persistentButtons.set(btn.id, btn);
            }
        }
        //start the listener
        teamBot.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isChatInputCommand()) {
                    teamBot.log(`${interaction.user.username} used ${interaction.commandName}`, false);
                    (teamBot.commands.get(interaction.commandName) as DiscordCommand).executeInteraction(teamBot.client, interaction, teamBot);
                }
                if (interaction.isContextMenuCommand()) {
                    teamBot.log(`${interaction.user.username} used ${interaction.commandName}`, false);
                    (teamBot.commands.get(interaction.commandName) as DiscordContextMenu).executeInteraction(teamBot.client, interaction, teamBot);
                }
            } catch (e) {
                teamBot.log(e as Error, true);
            }

            if (interaction.isButton()) {
                teamBot.log(`${interaction.user.username} pressed ${interaction.customId}`, false)
                /** if it isn't a persistent button, either wait for a
                 * reply or defer an update if it's a non-reply button */
                if (!teamBot.persistentButtons.has(interaction.customId)) {
                    if (nonReplyButtonIds.includes(interaction.customId)) {
                        //non-reply button
                        interaction.deferUpdate();
                        return;
                    } else if (nonDeferUpdateIds.includes(interaction.customId)) {
                        //non defer, usually if a modal is needed
                        setTimeout(() => {
                            if (!interaction.replied) {
                                interaction.reply({ embeds: [new MisunderstoodButtonEmbed(interaction.customId)], ephemeral: true });
                            }
                        }, 2_700);
                        return;
                    }
                    //not a persitent button, but should have a reply
                    interaction.deferReply();
                    setTimeout(() => {
                        if (!interaction.replied) {
                            interaction.followUp({ embeds: [new MisunderstoodButtonEmbed(interaction.customId)], ephemeral: true });
                            return;
                        }
                    }, 2_700);
                }
                teamBot.persistentButtons.get(interaction.customId)?.execute(teamBot, teamBot.client, interaction);
            }

            if(interaction.isModalSubmit()){
                console.timeLog(`${interaction.user.username} submit ${interaction.customId}`)
            }
        });
    }
}
