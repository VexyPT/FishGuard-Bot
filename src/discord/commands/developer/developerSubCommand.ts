import { Command } from "#base";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, formatEmoji } from "discord.js";

new Command({
    name: "developer",
    nameLocalizations: {
        "pt-BR": "desenvolvedor"
    },
    description: "「Developer Only」",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "manage-user",
            nameLocalizations: {
                "pt-BR": "gerenciar-usuário"
            },
            description: "「Developer Only」",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Mention or ID",
                    descriptionLocalizations: {
                        "pt-BR": "Menção ou ID do membro"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        }
    ],
    async run(interaction){

        const { options } = interaction;

        if (interaction.user.id != "435877436459188234") {
            interaction.reply({
                content: `${formatEmoji(settings.emojis.static.error)} Esse comando é apenas para o meu desenvolvedor!`
            });
            return;
        }
        
        switch (options.getSubcommand()) {
            case "manage-user": {

                const user = options.getUser("user") || interaction.user;

                const embedManager = new EmbedBuilder({
                    description: `Manage ${user}`,
                    color: hexToRgb(settings.colors.developer)
                });

                const row = createRow(
                    new ButtonBuilder({
                        customId: `manageDev/user/${user.id}/editBadges`,
                        label: "Editar Badges",
                        style: ButtonStyle.Primary
                    })
                );

                interaction.reply({
                    ephemeral,
                    embeds: [embedManager],
                    components: [row]
                });

                break;
            }
        }

    }
});