import { Collection, Message, MessageEmbed } from "discord.js"
import { color } from "../../config"
import { wordList } from "../../data/wordList"
import { messageReply } from "../../functions/discord/message"
import { Command } from "../../structures/Command"

export default new Command({
    name: "find-the-words",
    description: "Find the stupid word from the following line.",
    async execute(command) {
        const time = (Math.floor(Math.random() * 3) + 3) * (9 * 1000)
        let words = (await getWords(time / (9 * 1000))) as string[]
        const array = []

        let length = 20
        if (words.join("").length > length) length = words.join("").length - 1

        for (let i = 0; i < length; i++) {
            array.push(
                "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyz".length))
            )
        }

        words.forEach((e) => array.splice(Math.floor(Math.random() * array.length), 0, ` \`${e}\` `))

        let answered = []

        const arr = array.join("").replace(/(`| )/g, "")
        const highlights = array.join("")
        let embeds = [
            new MessageEmbed()
                .setColor(color)
                .setDescription(arr)
                .setTitle("Find the word for this line.")
                .addFields(
                    { name: "Time:", value: `${time / 1000}s` },
                    { name: "Answered:", value: answered.join(", ") || "** **" }
                ),
        ]

        const message = (await command.followUp({ embeds }).catch(console.error)) as Message
        const filter = (message: Message) => !message.author.bot

        const collector = message.channel.createMessageCollector({ time, filter })

        collector.on("collect", async (msg: Message) => {
            msg.content = msg.content.toLowerCase()

            if (!words.includes(msg.content)) {
                collector.collected.delete(msg.id)
                return messageReply(msg, `Wrong answer.`, false, 3)
            }

            answered.push(msg.content)
            words = words.filter((x) => x !== msg.content)

            if (words.length === 0) {
                messageReply(msg, `Correct answer. No words remand.`, false, 3)

                let players = Array.from(new Set(collector.collected.map((message) => message.author.username))).map(
                    (x) => `${x} : ${collector.collected.filter((y) => y.author.username === x).size}`
                )

                embeds = [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(highlights)
                        .setTitle("All words are found.")
                        .addFields(
                            { name: "Answered:", value: answered.join(", ") || "** **" },
                            { name: "Players:", value: players.join(", ") }
                        ),
                ]
                collector.collected.set("end", message)

                return message.edit({ embeds }).catch(console.error) as any
            }

            messageReply(msg, `Correct answer. There is ${words.length} more words`, false, 3)

            embeds = [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(arr)
                    .setTitle("Find the word for this line.")
                    .addFields(
                        { name: "Time:", value: `${time / 1000}s` },
                        { name: "Answered:", value: answered.join(", ") || "** **" }
                    ),
            ]
            return message.edit({ embeds }).catch(console.error) as any
        })

        collector.on("end", async (collection: Collection<string, any>) => {
            if (collection.get("end")) return

            if (collection.size === 0) {
                embeds = [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(highlights)
                        .setTitle("Game timeout.")
                        .addFields(
                            { name: "Time:", value: `${time / 1000}s` },
                            { name: "Words:", value: words.join(", ") }
                        ),
                ]
                return message.edit({ embeds }).catch(console.error) as any
            }

            let players = Array.from(new Set(collector.collected.map((message) => message.author.username))).map(
                (x) => `${x} : ${collector.collected.filter((y) => y.author.username === x).size}`
            )

            embeds = [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(highlights)
                    .setTitle("Game timeout.")
                    .addFields(
                        { name: "Time:", value: `${time / 1000}s` },
                        { name: "Words:", value: words.join(", ") },
                        { name: "Answered:", value: answered.join(", ") || "** **" },
                        { name: "Players:", value: players.join(", ") }
                    ),
            ]
            return message.edit({ embeds }).catch(console.error) as any
        })
    },
})

async function getWords(amount: number) {
    function randomizeIndex(array: string[]) {
        if (array.length === 0) return array
        for (let index = 0; index < array.length; index++) {
            let i = Math.floor(Math.random() * array.length)
            let randomItem = array[i]
            array[i] = array[index]
            array[index] = randomItem
        }
        return array
    }

    const list = randomizeIndex(wordList)
    return list.slice(0, amount)
}