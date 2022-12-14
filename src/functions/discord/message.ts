import {
    ButtonInteraction,
    ColorResolvable,
    CommandInteraction,
    Message,
    MessageComponentInteraction,
    MessageEmbed,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    TextBasedChannel,
    User,
} from "discord.js"
import { logError } from "../log/logger"

const defaultColor = "#2f3136"

export const followUp = async (
    interaction: CommandInteraction,
    content: string,
    time?: number,
    color: ColorResolvable = defaultColor,
) => {
    const embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await interaction.followUp({ embeds }).catch(logError)) as Message

    if (!message) return

    const deleteMessage = async () => await message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const interactionReply = async (
    interaction:
        | CommandInteraction
        | SelectMenuInteraction
        | ButtonInteraction
        | MessageComponentInteraction
        | ModalSubmitInteraction,
    content: string,
    ephemeral?: boolean,
    time?: number,
    color: ColorResolvable = defaultColor,
) => {
    if (!ephemeral) ephemeral = false
    const embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    await interaction.reply({ embeds, ephemeral }).catch(logError)

    const deleteMessage = async () => await interaction.deleteReply().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
}

export const messageReply = async (
    message: Message,
    content: string,
    allowedMentions?: boolean,
    time?: number,
    color: ColorResolvable = defaultColor,
) => {
    if (!color) color = defaultColor
    if (!allowedMentions) allowedMentions = false
    const embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const newMessage = (await message
        .reply({ embeds, allowedMentions: { repliedUser: allowedMentions } })
        .catch(logError)) as unknown as Message

    if (!newMessage) return

    const deleteMessage = async () => await message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return newMessage
}

export const send = async (
    channel: User | TextBasedChannel,
    content: string,
    time?: number,
    color: ColorResolvable = defaultColor,
) => {
    const embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    const message = (await channel.send({ embeds }).catch(logError)) as Message

    if (!message) return

    const deleteMessage = async () => await message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}

export const edit = async (message: Message, content: string, time?: number, color: ColorResolvable = defaultColor) => {
    const embeds = [new MessageEmbed().setDescription(content).setColor(color)]
    await message.edit({ embeds, content: " ", components: [], files: [] }).catch(logError)

    const deleteMessage = async () => await message.delete().catch(logError)
    if (time) setTimeout(deleteMessage, time * 1000)
    return message
}
