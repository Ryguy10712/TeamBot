import { ButtonBuilder, SelectMenuBuilder, ModalBuilder, SelectMenuOptionBuilder } from "@discordjs/builders";
import { ActionRow, ActionRowBuilder, ButtonStyle } from "discord.js";

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
    }
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
    .addComponents(new ButtonBuilder().setCustomId("teamcfgTrue").setLabel("True").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId("teamcfgFalse").setLabel("False").setStyle(ButtonStyle.Danger));
