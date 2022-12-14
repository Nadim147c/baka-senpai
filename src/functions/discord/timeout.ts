import {
    ButtonInteraction,
    CommandInteraction,
    Interaction,
    Message,
    MessageActionRow,
    SelectMenuInteraction,
} from "discord.js"
import { logError } from "../log/logger"
import { createButton } from "./components"

type option = {
    message?: Message
    interaction?: CommandInteraction | ButtonInteraction | SelectMenuInteraction
}
export const timeOut = async (
    timeOutType: "DENY" | "TIMEOUT" | "NOREPLY" | "DISABLE",
    { message, interaction }: option,
    components: MessageActionRow[] = [],
) => {
    if (!message && !interaction) return

    switch (timeOutType) {
        case "TIMEOUT":
            components = [
                new MessageActionRow().setComponents(
                    createButton("User didn't replied to me.", "timeout", "SECONDARY", true),
                ),
            ]
            break
        case "NOREPLY":
            components = [
                new MessageActionRow().setComponents(
                    createButton("Command has been timed out.", "timeout", "SECONDARY", true),
                ),
            ]
            break
        case "DENY":
            components = [
                new MessageActionRow().setComponents(
                    createButton("User denied the confirmation.", "timeout", "SECONDARY", true),
                ),
            ]
            break
        case "DISABLE":
            components.forEach((x) => x.components.forEach((y) => (y.disabled = true)))
            break
    }

    if (message) return message.edit({ components }).catch(logError)
    if (interaction) return interaction.editReply({ components }).catch(logError)
}
