import { Command } from "#base";
import { db } from "#database";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, formatEmoji } from "discord.js";

new Command({
    name: "developer",
    description: "「Developer Only」",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "manage-user",
            description: "「Developer Only」",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Mention or ID",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "generate-key",
            description: "「Developer Only」",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "amount",
                    description: "Amount of keys to generate",
                    type: ApplicationCommandOptionType.Number,
                    minValue: 1,
                    maxValue: 10,
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
            } // fim do /manage user

            case "generate-key": {

                const numberOfKeys = options.getNumber("amount") || 1;
                const generatedKeys = [];

                for (let i = 0; i < numberOfKeys; i++) {
                    const newKey = await db.keys.create({ key: generateKey() });
                    generatedKeys.push(newKey.key);
                }

                const embedGeneratedKeys = new EmbedBuilder({
                    description: `Generated ${numberOfKeys} key(s): \n${generatedKeys.join("\n")}`,
                    color: hexToRgb(settings.colors.developer),
                });

                interaction.reply({
                    ephemeral: true,
                    embeds: [embedGeneratedKeys],
                });
            
                break;

            }
        }

    }
});

function generateKey(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const keyLenght = 20;
    let key = "";

    for (let i = 0; i < keyLenght; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return key;
}