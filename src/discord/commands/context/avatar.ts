import { Command } from "#base";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { settings } from "#settings";
import { hexToRgb } from "@magicyan/discord";

new Command({
    name: "avatar",
    dmPermission: false,
    type: ApplicationCommandType.User,
    async run(interaction) {
        
        const { targetMember } = interaction;

        const embedAvatar = new EmbedBuilder({
            author: { name: targetMember!.displayName, url: targetMember!.displayAvatarURL() },
            image: { url: targetMember!.displayAvatarURL({ size: 1024 }) },
            color: hexToRgb(settings.colors.azoxo)
        });

        await interaction.reply({ embeds: [embedAvatar], ephemeral });

    }
});