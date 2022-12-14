import { coin } from "../../config"
import { getUserData } from "../../functions/userDB/getData"
import { getDynamicTime } from "../../functions/discord/getDynamicTime"
import { followUp } from "../../functions/discord/message"
import { Command } from "../../structures/Command"
import { addCoin } from "../../functions/userDB/coin"

export default new Command({
    name: "daily",
    description: "Get fixed amount of coin every day.",
    botPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
    async execute(command) {
        const userData = await getUserData(command.user.id)

        const currentTime = new Date().valueOf()
        const { daily } = userData

        const DAY = 1000 * 60 * 60 * 24 // a day in ms
        const nextDay = daily.time.valueOf() + DAY

        if (currentTime - daily.time.valueOf() < DAY) {
            const time = getDynamicTime(nextDay, "RELATIVE")
            return command.followUp(`You can't use this command now.\nYou'll be able to use this command ${time}.`)
        }

        userData.daily.time = new Date()
        addCoin(userData, daily.amount)

        followUp(command, `You got **${daily.amount}** ${coin} from daily.`)
    },
})
