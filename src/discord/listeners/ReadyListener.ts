import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";
import { Routes } from "discord.js";
import dotenv from "dotenv"
dotenv.config()

export class ReadyListener extends DiscordListener {
    registerListener(teamBot: TeamBot): void {
        teamBot.client.on("ready", async () => {
            console.log("Team Bot is ready")

            try{
                const auth = {"Authorization": "Bot MTA0MDExNTg5MjI0NTIzNzg2MA.G0LUd3.qeLX1ZG6UTZooFiQaUZVsVvAZMEGNT-SiEL6JU"}
                let inDevBody: Array<any> = []
                let body: any = []
                await teamBot.commands.forEach(command => {
                    if(command.inDev){
                        inDevBody.push(command.properties.toJSON())
                    } else {
                        body.push(command.properties.toJSON())
                    }
                })

                if(inDevBody.length){
                    console.log(inDevBody)
                    await teamBot.rest.put(
                        Routes.applicationGuildCommands(process.env.APPLICATION_ID!, process.env.TESTING_GUILD_ID!),
                        {headers: auth, body: inDevBody}
                    )
                } 
                if(body.length){
                    await teamBot.rest.put(
                        Routes.applicationCommands("1040115892245237860"),
                        {body: body}
                    )
                }
            }
            catch (error) {
                console.error(error)
            }
        })
    }
}