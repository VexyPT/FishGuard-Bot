import { Command } from "#base";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, ButtonBuilder, ButtonStyle, formatEmoji } from "discord.js";

new Command({
    name: "avatar",
    description: "「Discord」 Mostra o avatar do seu perfil ou o avatar do perfil de outro usuário",
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
            title: "Avatar do Servidor",
            author: { name: `${user.displayName}`, iconURL: user.displayAvatarURL() },
            image: { url: user.displayAvatarURL({ size: 1024 }) },
            color: hexToRgb(settings.colors.azoxo)
        });

        const row = createRow(
            new ButtonBuilder({
                customId: `avatar/user/${user.id}/global`,
                label: "Avatar Global",
                style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId: `avatar/user/${user.id}/server`,
                label: "Avatar do Servidor",
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                url: `${user.displayAvatarURL()}`,
                label: "Download",
                emoji: `${formatEmoji(settings.emojis.static.touch)}`,
                style: ButtonStyle.Link
            })
        );

        await interaction.reply({ embeds: [embedAvatar], components: [row] });

    }
});