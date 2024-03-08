import { Command } from "#base";
import { settings } from "#settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
    name: "avatar",
    description: "[DISCORD] Mostra o avatar do seu perfil ou o avatar do perfil de outro usuário",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "O usuário que você quer roubar... Quer dizer, ver, o seu avatar ^^",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async run(interaction) {

        const { options } = interaction;

        const user = options.getUser("usuario") || interaction.user;

        const embedAvatar = new EmbedBuilder({
            author: { name: user.displayName, url: user.displayAvatarURL() },
            image: { url: user.displayAvatarURL({ size: 1024 }) },
            color: hexToRgb(settings.colors.azoxo)
        });

        await interaction.reply({ embeds: [embedAvatar] });

    }
});