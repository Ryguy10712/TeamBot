"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const tslib_1 = require("tslib");
const DiscordListener_1 = require("../DiscordListener");
const discord_js_1 = require("discord.js");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
class ReadyListener extends DiscordListener_1.DiscordListener {
    registerListener(teamBot) {
        teamBot.client.on("ready", async () => {
            console.log("Team Bot is ready");
            try {
                const auth = { "Authorization": "Bot MTA0MDExNTg5MjI0NTIzNzg2MA.G0LUd3.qeLX1ZG6UTZooFiQaUZVsVvAZMEGNT-SiEL6JU" };
                let inDevBody = [];
                let body = [];
                await teamBot.commands.forEach(command => {
                    if (command.inDev) {
                        inDevBody.push(command.properties.toJSON());
                    }
                    else {
                        body.push(command.properties.toJSON());
                    }
                });
                if (inDevBody.length) {
                    console.log(inDevBody);
                    await teamBot.rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.TESTING_GUILD_ID), { headers: auth, body: inDevBody });
                }
                if (body.length) {
                    await teamBot.rest.put(discord_js_1.Routes.applicationCommands("1040115892245237860"), { body: body });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.ReadyListener = ReadyListener;
//# sourceMappingURL=ReadyListener.js.map