import { DiscordListener } from "../DiscordListener";
import { TeamBot } from "../../Bot";
import { Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config()

export class ReadyListener extends DiscordListener {
    startListener(teamBot: TeamBot): void {
        teamBot.client.on("ready", async (client) => {
            console.log(`${client.user.username} is ready`)
            if(teamBot.maintenanceMode){
                teamBot.client.user?.setActivity({name: "Maintenance..."})
            }
            //registers commands under the DiscordAPI application
            try{
                const auth = {"Authorization": `Bot ${process.env.TOKEN}`}
                let inDevBody: Array<any> = []
                let body: any = []
                teamBot.commands.forEach(command => {
                    if(command.inDev){
                        inDevBody.push(command.properties.toJSON())
                    } else {
                        body.push(command.properties.toJSON())
                    }
                })
                
                if(inDevBody.length){
                    await teamBot.rest.put(
                        Routes.applicationGuildCommands(process.env.APPLICATION_ID!, process.env.TESTING_GUILD_ID!),
                        {headers: auth, body: inDevBody}
                    )
                } 
                if(body.length){
                    await teamBot.rest.put(
                        Routes.applicationCommands(process.env.APPLICATION_ID!),
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