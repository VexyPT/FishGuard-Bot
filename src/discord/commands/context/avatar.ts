import { Command } from "#base";
import { ApplicationCommandType, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";

new Command({
    name: "avatar",
    dmPermission: false,
    type: ApplicationCommandType.User,
    async run(interaction) {
        
        const { targetMember } = interaction;

        const embedAvatar = new EmbedBuilder({
            author: { name: `${targetMember!.displayName}`, iconURL: targetMember!.displayAvatarURL() },
            image: { url: targetMember!.displayAvatarURL({ size: 1024 }) },
            color: hexToRgb(settings.colors.azoxo)
        });

        const row = createRow(
            new ButtonBuilder({
                customId: `avatar/user/${targetMember!.id}/global`,
                label: "Avatar Global",
                style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId: `avatar/user/${targetMember!.id}/server`,
                label: "Avatar do Servidor",
                style: ButtonStyle.Primary
            }),
            new ButtonBuilder({
                url: `${targetMember!.displayAvatarURL()}`,
                label: "Download",
                style: ButtonStyle.Link
            })
        );

        await interaction.reply({ embeds: [embedAvatar], components: [row], ephemeral });

    }
});