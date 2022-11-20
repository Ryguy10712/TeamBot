"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidentialityButtons = exports.RemovePlayerButton = exports.AddPlayerButton = exports.EditButton = exports.TeamConfigRow = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
class TeamConfigRow extends discord_js_1.ActionRowBuilder {
    constructor(type) {
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
exports.TeamConfigRow = TeamConfigRow;
const TeamConfigMenu0 = new builders_1.SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions({
    label: "Add a player",
    default: true,
    value: "addPlayer",
}, {
    label: "Remove a player",
    value: "removePlayer",
}, {
    label: "Edit team name",
    value: "editName",
}, {
    label: "Set team confidentiality",
    value: "confidential",
});
const TeamConfigMenu1 = new builders_1.SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions({
    label: "Add a player",
    value: "addPlayer",
}, {
    label: "Remove a player",
    default: true,
    value: "removePlayer",
}, {
    label: "Edit team name",
    value: "editName",
}, {
    label: "Set team confidentiality",
    value: "confidential",
});
const TeamConfigMenu2 = new builders_1.SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions({
    label: "Add a player",
    value: "addPlayer",
}, {
    label: "Remove a player",
    value: "removePlayer",
}, {
    label: "Edit team name",
    default: true,
    value: "editName",
}, {
    label: "Set team confidentiality",
    value: "confidential",
});
const TeamConfigMenu3 = new builders_1.SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions({
    label: "Add a player",
    value: "addPlayer",
}, {
    label: "Remove a player",
    value: "removePlayer",
}, {
    label: "Edit team name",
    value: "editName",
}, {
    label: "Set team confidentiality",
    default: true,
    value: "confidential",
});
exports.EditButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgEdit").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Edit"));
exports.AddPlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgAdd").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Add Player"));
exports.RemovePlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgRemove").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Remove Player"));
exports.ConfidentialityButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgTrue").setLabel("True").setStyle(discord_js_1.ButtonStyle.Success))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgFalse").setLabel("False").setStyle(discord_js_1.ButtonStyle.Danger));
//# sourceMappingURL=TeamConfigComponents.js.map