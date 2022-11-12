import {TeamBot} from "../Bot"

export abstract class DiscordListener {
    abstract registerListener(teamBot: TeamBot): void
}