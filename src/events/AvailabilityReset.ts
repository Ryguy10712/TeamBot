import cron from "node-cron";
import { TeamBot } from "../Bot";
import fs from "fs";
import { PCLTeam } from "../interfaces/PCLTeam";
import { GuildTextBasedChannel } from "discord.js";

export async function AvailabilityReset(teamBot: TeamBot) {
    cron.schedule("0 0 * * 2", async function () { //run every tuesday at 0:00 (12 AM)
        console.log("cron job is running")
        const teamsDb: PCLTeam[] = JSON.parse(fs.readFileSync("./db/teams.json", "utf-8"));

        for (const team of teamsDb) {
            if (!team.availability) return; //team doesn't have availability set up

            const schedChan = (await teamBot.client.channels.fetch(team.schedulingChannel!)) as GuildTextBasedChannel;
            const REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🕚", "🕛"];
            //start removing reactions from all the messages
            for (const messageId of team.availability.messageIds) {
                schedChan.messages.fetch(messageId).then((message) => {
                    message.reactions.removeAll().then((message) => {
                        for (const reaction of REACTIONS) {
                            message.react(reaction);
                        }
                        message.react("❌");
                    });
                });
            }
            let teamAvailability: PCLTeam["availability"] = {
                messageIds: [],
                tuesday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                wednesday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                thursday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                friday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                saturday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                sunday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
                monday: {
                    "1PM": [],
                    "2PM": [],
                    "3PM": [],
                    "4PM": [],
                    "5PM": [],
                    "6PM": [],
                    "7PM": [],
                    "8PM": [],
                    "9PM": [],
                    "10PM": [],
                    "11PM": [],
                    "12PM": [],
                },
            };
            teamAvailability.messageIds = team.availability.messageIds
            team.availability = teamAvailability;
            fs.writeFileSync("./db/teams.json", JSON.stringify(teamsDb));
        }
    });
}
