import { ButtonBuilder, SelectMenuBuilder, ModalBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, TextInputBuilder, TextInputStyle } from "discord.js";

//COMPONENTS
export class TeamConfigRow extends ActionRowBuilder<SelectMenuBuilder> {
    constructor(type: number) {
        super();
        switch (type) {
            case 0:
                this.setComponents(TeamConfigMenu0);
                break;
            case 1:
                this.setComponents(TeamConfigMenu1);
                break;
            case 2:
                this.setComponents(TeamConfigMenu2);
                break;
            case 3:
                this.setComponents(TeamConfigMenu3);
                break;
            case 4: 
                this.setComponents(TeamConfigMenu4)
                break;
        }
    }
}

const TeamConfigMenu0 = new SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions(
    {
        label: "Add a player",
        default: true,
        value: "addPlayer",
    },
    {
        label: "Remove a player",
        value: "removePlayer",
    },
    {
        label: "Edit team name",
        value: "editName",
    },
    {
        label: "Set team confidentiality",
        value: "confidential",
    },
    {
        label: "Set team rank",
        value: "rank",
    }
);

const TeamConfigMenu1 = new SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions(
    {
        label: "Add a player",
        value: "addPlayer",
    },
    {
        label: "Remove a player",
        default: true,
        value: "removePlayer",
    },
    {
        label: "Edit team name",
        value: "editName",
    },
    {
        label: "Set team confidentiality",
        value: "confidential",
    },
    {
        label: "Set team rank",
        value: "rank",
    }
);

const TeamConfigMenu2 = new SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions(
    {
        label: "Add a player",
        value: "addPlayer",
    },
    {
        label: "Remove a player",
        value: "removePlayer",
    },
    {
        label: "Edit team name",
        default: true,
        value: "editName",
    },
    {
        label: "Set team confidentiality",
        value: "confidential",
    },
    {
        label: "Set team rank",
        value: "rank",
    }
);

const TeamConfigMenu3 = new SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions(
    {
        label: "Add a player",
        value: "addPlayer",
    },
    {
        label: "Remove a player",
        value: "removePlayer",
    },
    {
        label: "Edit team name",
        value: "editName",
    },
    {
        label: "Set team confidentiality",
        default: true,
        value: "confidential",
    },
    {
        label: "Set team rank",
        value: "rank",
    }
);

const TeamConfigMenu4 = new SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions(
    {
        label: "Add a player",
        value: "addPlayer",
    },
    {
        label: "Remove a player",
        value: "removePlayer",
    },
    {
        label: "Edit team name",
        value: "editName",
    },
    {
        label: "Set team confidentiality",
        value: "confidential",
    },
    {
        label: "Set team rank",
        default: true,
        value: "rank",
    }
);

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

export const ConfidentialityButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId("teamcfgTrue").setLabel("Enable").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgFalse").setLabel("Disable").setStyle(ButtonStyle.Danger));

export const RankButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId("teamcfgGold").setLabel("Gold").setStyle(ButtonStyle.Primary))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgSilver").setLabel("Silver").setStyle(ButtonStyle.Primary))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgBronze").setLabel("Bronze").setStyle(ButtonStyle.Primary));
