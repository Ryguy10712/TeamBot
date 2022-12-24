"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankButtons = exports.ConfidentialityButtons = exports.SetCoCapButton = exports.RemovePlayerButton = exports.AddPlayerButton = exports.EditButton = exports.SetCoCapModal = exports.EditModal = exports.RemovePlayerModal = exports.AddPlayerModal = exports.TeamConfigMenu = exports.TeamConfigRow = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
var MenuState;
(function (MenuState) {
    MenuState[MenuState["addPlayer"] = 0] = "addPlayer";
    MenuState[MenuState["removePlayer"] = 1] = "removePlayer";
    MenuState[MenuState["setCoCap"] = 2] = "setCoCap";
    MenuState[MenuState["editName"] = 3] = "editName";
    MenuState[MenuState["confidential"] = 4] = "confidential";
    MenuState[MenuState["rank"] = 5] = "rank";
})(MenuState || (MenuState = {}));
class TeamConfigRow extends discord_js_1.ActionRowBuilder {
    constructor(state) {
        super();
        this.setComponents(new TeamConfigMenu(state));
    }
}
exports.TeamConfigRow = TeamConfigRow;
class TeamConfigMenu extends builders_1.SelectMenuBuilder {
    constructor(state) {
        super();
        this.setCustomId("teamcfgMenu");
        this.setOptions([
            {
                label: "Add player",
                value: "addPlayer"
            },
            {
                label: "Remove player",
                value: "removePlayer",
            },
            {
                label: "Set co-captain",
                value: "setCoCap",
            },
            {
                label: "Edit team name",
                value: "editName",
            },
            {
                label: "Set team confidentiality",
                value: "confidential"
            },
            {
                label: "Set team rank",
                value: "rank"
            }
        ]);
        const data = this.toJSON();
        data.options.find(option => {
            return option.value == MenuState[state];
        }).default = true;
    }
}
exports.TeamConfigMenu = TeamConfigMenu;
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
exports.SetCoCapModal = new builders_1.ModalBuilder()
    .setTitle("Set co-captain")
    .setCustomId("setCoCapModal")
    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setLabel("Oculus username").setCustomId("setCoCapText").setStyle(discord_js_1.TextInputStyle.Short)));
exports.EditButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgEdit").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Edit"));
exports.AddPlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgAdd").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Add Player"));
exports.RemovePlayerButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgRemove").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Remove Player"));
exports.SetCoCapButton = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgCoCap").setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("Set co-captain"));
exports.ConfidentialityButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgTrue").setLabel("Enable").setStyle(discord_js_1.ButtonStyle.Success))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgFalse").setLabel("Disable").setStyle(discord_js_1.ButtonStyle.Danger));
exports.RankButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgGold").setLabel("Gold").setStyle(discord_js_1.ButtonStyle.Primary))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgSilver").setLabel("Silver").setStyle(discord_js_1.ButtonStyle.Primary))
    .addComponents(new builders_1.ButtonBuilder().setCustomId("teamcfgBronze").setLabel("Bronze").setStyle(discord_js_1.ButtonStyle.Primary));
//# sourceMappingURL=TeamMenuComponents.js.map