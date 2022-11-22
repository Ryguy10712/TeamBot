"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankButtons = exports.ConfidentialityButtons = exports.RemovePlayerButton = exports.AddPlayerButton = exports.EditButton = exports.EditModal = exports.RemovePlayerModal = exports.AddPlayerModal = exports.TeamConfigRow = void 0;
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
            case 4:
                this.setComponents(TeamConfigMenu4);
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
}, {
    label: "Set team rank",
    value: "rank",
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
}, {
    label: "Set team rank",
    value: "rank",
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
}, {
    label: "Set team rank",
    value: "rank",
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
}, {
    label: "Set team rank",
    value: "rank",
});
const TeamConfigMenu4 = new builders_1.SelectMenuBuilder().setCustomId("teamcfgMenu").setOptions({
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
    value: "confidential",
}, {
    label: "Set team rank",
    default: true,
    value: "rank",
});
exports.AddPlayerModal = new builders_1.ModalBuilder()
    .setTitle("Add a player")
    .setCustomId("addPlayerModal")
    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setLabel("Oculus username").setRequired(true).setStyle(discord_js_1.TextInputStyle.Short).setMaxLength(15).setCustomId("addPlayerText")));
exports.RemovePlayerModal = new builders_1.ModalBuilder()
    .setTitle("Remove a player")
    .setCustomId("removePlayerModal")
    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setLabel("Oculus username").setRequired(true).setStyle(discord_js_1.TextInputStyle.Short).setMaxLength(15).setCustomId("removePlayerText")));
exports.EditModal = new builders_1.ModalBuilder()
    .setTitle("Edit team name")
    .setCustomId("editModal")
    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("editText").setLabel("Poopoo fard").setStyle(discord_js_1.TextInputStyle.Short)));
exports.EditButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgEdit").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Edit"));
exports.AddPlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgAdd").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Add Player"));
exports.RemovePlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgRemove").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Remove Player"));
exports.ConfidentialityButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgTrue").setLabel("Enable").setStyle(discord_js_1.ButtonStyle.Success))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgFalse").setLabel("Disable").setStyle(discord_js_1.ButtonStyle.Danger));
exports.RankButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgGold").setLabel("Gold").setStyle(discord_js_1.ButtonStyle.Primary))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgSilver").setLabel("Silver").setStyle(discord_js_1.ButtonStyle.Primary))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgBronze").setLabel("Bronze").setStyle(discord_js_1.ButtonStyle.Primary));
//# sourceMappingURL=TeamMenuComponents.js.map