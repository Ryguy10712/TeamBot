import { ButtonBuilder, SelectMenuBuilder, ModalBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, SelectMenuComponentData, TextInputBuilder, TextInputStyle } from "discord.js";

enum MenuState {
    addPlayer,
    removePlayer,
    setCoCap,
    editName,
    confidential,
    rank,
    availabilityVisibility
}

//COMPONENTS
export class TeamConfigRow extends ActionRowBuilder<SelectMenuBuilder> {
    constructor(state: MenuState) {
        super();
        this.setComponents(new TeamConfigMenu(state))
    }
}

export class TeamConfigMenu extends SelectMenuBuilder {
    
    constructor(state: MenuState){
        super()
        this.setCustomId("teamcfgMenu")
        this.setOptions([
            {
                label: "Add player",
                value: "addPlayer",
                default: state === MenuState.addPlayer
            },
            {
                label: "Remove player",
                value: "removePlayer",
                default: state === MenuState.removePlayer
            },
            {
                label: "Set co-captain",
                value: "setCoCap",
                default: state === MenuState.setCoCap
            },
            {
                label: "Edit team name",
                value: "editName",
                default: state === MenuState.editName
            },
            {
                label: "Set team confidentiality",
                value: "confidential",
                default: state === MenuState.confidential
            },
            {
                label: "Set team rank",
                value: "rank",
                default: state === MenuState.rank
            },
            {
                label: "Set team availability visibility",
                value: "availabilityVisibility",
                default: state === MenuState.availabilityVisibility
            }
        ])
        //set proper field as the default field
        const data = this.toJSON() as unknown as SelectMenuComponentData
        data.options!.find(option => {
            return option.value == MenuState[state]
        })!.default = true

        }

}


export const AddPlayerModal = new ModalBuilder()
    .setTitle("Add a player")
    .setCustomId("addPlayerModal")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder().setLabel("Oculus username").setRequired(true).setStyle(TextInputStyle.Short).setMaxLength(15).setCustomId("addPlayerText")
        )
    );

export const RemovePlayerModal = new ModalBuilder()
    .setTitle("Remove a player")
    .setCustomId("removePlayerModal")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder().setLabel("Oculus username").setRequired(true).setStyle(TextInputStyle.Short).setMaxLength(15).setCustomId("removePlayerText")
        )
    );

export const EditModal = new ModalBuilder()
    .setTitle("Edit team name")
    .setCustomId("editModal")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder().setCustomId("editText").setLabel("Poopoo fard").setStyle(TextInputStyle.Short)
        )
    );

export const SetCoCapModal = new ModalBuilder()
    .setTitle("Set co-captain")
    .setCustomId("setCoCapModal")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder().setLabel("Oculus username").setCustomId("setCoCapText").setStyle(TextInputStyle.Short)
        )
    )

//ACTION ROWS
export const EditButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("teamcfgEdit").setStyle(ButtonStyle.Secondary).setLabel("Edit")
);

export const AddPlayerButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("teamcfgAdd").setStyle(ButtonStyle.Secondary).setLabel("Add Player")
);

export const RemovePlayerButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("teamcfgRemove").setStyle(ButtonStyle.Secondary).setLabel("Remove Player")
);

export const SetCoCapButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("teamcfgCoCap").setStyle(ButtonStyle.Secondary).setLabel("Set co-captain")
)

export const ConfidentialityButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId("teamcfgTrue").setLabel("Enable").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgFalse").setLabel("Disable").setStyle(ButtonStyle.Danger));

export const RankButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId("teamcfgGold").setLabel("Gold").setStyle(ButtonStyle.Primary))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgSilver").setLabel("Silver").setStyle(ButtonStyle.Primary))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgBronze").setLabel("Bronze").setStyle(ButtonStyle.Primary));


