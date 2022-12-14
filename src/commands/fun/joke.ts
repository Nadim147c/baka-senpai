import { Command } from "../../structures/Command"
import axios from "axios"
import { followUp } from "../../functions/discord/message"

export default new Command({
    name: "joke",
    description: "Hack someone to get nothing.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const URL =
            "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single"

        const data = await axios(URL)
            .then((x) => x.data)
            .catch(console.error)

        if (!data) return followUp(command, `Failed to get joke!`)

        followUp(command, data.joke)
    },
})
