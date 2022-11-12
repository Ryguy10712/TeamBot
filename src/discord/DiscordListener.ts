import {TeamBot} from "../Bot"

export abstract class DiscordListener {
    abstract startListener(teamBot: TeamBot): void
}