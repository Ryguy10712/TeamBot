import { Client, CommandInteraction, CacheType } from "discord.js";
import { TeamBot } from "../../Bot";
import { DiscordCommand } from "../DiscordCommand";
import {randomInt} from "crypto"

export class SpamBruhvyCommand extends DiscordCommand {
    public inDev: boolean;
    private catGifs: string[];
    private bruhvyId = "396390197081800704"

    constructor() {
        super();
        this.properties.setName("spam_bruhvy").setDescription("sends a cat gif to bruhvy");

        this.inDev = false;
        this.catGifs = [
            "https://tenor.com/view/funny-cat-gif-26552422",
            "https://tenor.com/view/byuntear-sad-sad-cat-cat-meme-gif-25617057",
            "https://tenor.com/view/ok-cat-gif-26154702",
            "https://tenor.com/view/cat-kitty-pussycat-feline-gif-26001328",
            "https://tenor.com/view/meevin-melvin-hes-coming-321-run-gif-26186363",
            "https://tenor.com/view/cat-gif-25142188",
            "https://tenor.com/view/sad-cat-gif-26067066",
            "https://tenor.com/view/cat-dancing-meme-dancing-cat-white-cat-meme-gif-24092585",
            "https://tenor.com/view/eepy-and-why-he-eepy-laughing-crying-emoji-animals-with-captions-cat-meme-gif-25115470",
            "https://tenor.com/view/rrane-battal-rrane-battal-k%C4%B1zg%C4%B1n-battal-k%C4%B1zg%C4%B1n-gif-25355985",
        ];
    }

    async executeInteraction(client: Client<boolean>, interaction: CommandInteraction<CacheType>, teamBot: TeamBot) {
        const bruhvy = await client.users.fetch(this.bruhvyId)
        const index = randomInt(9)
        bruhvy.send(this.catGifs[index])
        interaction.reply({ephemeral: true, content: "Success"})
    }
}
