import { Command } from "#base";
import {
    ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder,
    ButtonBuilder, ButtonStyle, formatEmoji, codeBlock, time
} from "discord.js";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import axios from "axios";

new Command({
    name: "user",
    nameLocalizations: {
        "pt-BR": "usuário"
    },
    description: "gerencia o modulo de user",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "avatar",
            description: "See a user's avatar",
            descriptionLocalizations: {
                "pt-BR": "「Discord」 Mostra o avatar do seu perfil ou o avatar do perfil de outro usuário"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "user"
                    },
                    description: "Mention or ID",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você quer roubar... Quer dizer, ver, o seu avatar ^^"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: false
                },
            ],
        },
        {
            name: "banner",
            description: "「Discord」 See a banner from a user",
            descriptionLocalizations: {
                "pt-BR": "「Discord」 Veja um banner de um usuário do servidor"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "user"
                    },
                    description: "Mention or ID",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você quer roubar... Quer dizer, ver, o seu banner ^^"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "info",
            description: "「Discord」 Show a user's information",
            descriptionLocalizations: {
                "pt-BR": "「Discord」 Mostre as informações de um usuário no Discord"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "user"
                    },
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
        const { client, options, guild } = interaction;

        switch (options.getSubcommand()) {

            case "avatar": {

                const user = options.getUser("user") || interaction.user;

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
            
                break;
            } // final do /user avatar
            
            case "banner": {

                const user = options.getUser("user") || interaction.user;

                axios.get(`https://discord.com/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                }).then((res) => {
                    const { banner } = res.data;

                    if (banner) {

                        const extension = banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
                        const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                        const embedBanner = new EmbedBuilder({
                            author: { name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` },
                            image: { url: bannerUrl },
                            color: hexToRgb(settings.colors.azoxo)
                        });

                        const buttonBanner = createRow(
                            new ButtonBuilder({
                                label: "Download",
                                emoji: formatEmoji(settings.emojis.static.touch),
                                style: ButtonStyle.Link,
                                url: bannerUrl
                            })
                        );

                        interaction.reply({
                            embeds: [embedBanner],
                            components: [buttonBanner]
                        });

                    } else {
                        interaction.reply({
                            content: `${interaction.user != user ? `${formatEmoji(settings.emojis.static.error)} ${user} não tem um banner no seu perfil! Provavelmente ele/ela não tem Discord Nitro ou decidiu não colocar um banner` : `${formatEmoji(settings.emojis.static.error)} Você não tem um banner no seu perfil`}`,
                            ephemeral: true
                        });
                    }
                });
                break;
            } // fim do /user banner

            case "info": {

                const user = options.getUser("user") || interaction.user;

                const flags = user.flags?.toArray();
                const flag2 = {
                    "Staff": `${formatEmoji(settings.emojis.static.badges.staff)}`,
                    "Partner": `${formatEmoji(settings.emojis.static.badges.partner)}`,
                    "CertifiedModerator": `${formatEmoji(settings.emojis.static.badges.moderator)}`,
                    "Hypesquad": "",
                    "HypeSquadOnlineHouse1": "",
                    "HypeSquadOnlineHouse2": "",
                    "HypeSquadOnlineHouse3": "",
                    "BugHunterLevel1": `${formatEmoji(settings.emojis.static.badges.bugHunter)}`,
                    "BugHunterLevel2": `${formatEmoji(settings.emojis.static.badges.goldBugHunter)}`,
                    "ActiveDeveloper": "",
                    "VerifiedDeveloper": `${formatEmoji(settings.emojis.static.badges.earlyDeveloper)}`,
                    "PremiumEarlySupporter": `${formatEmoji(settings.emojis.static.badges.earlySupporter)}`,
                    "VerifiedBot": "",
                };

                let badge: string[] = [];

                if (flags) {
                    badge = flags
                        .filter(flag => flag in flag2)
                        .map(flag => flag2[flag as keyof typeof flag2]);
                }

                const badges = badge.join("");

                axios.get(`https://discord.com/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                }).then((res) => {

                    const { banner } = res.data;
                    const createdAt = user.createdAt;

                    const embedInfo = new EmbedBuilder({
                        thumbnail: { url: user.displayAvatarURL({ size: 1024 })},
                        color: hexToRgb(settings.colors.azoxo)
                    });

                    if (badges?.length! > 255) {
                        embedInfo.setAuthor({ name: `${user.globalName}`, iconURL: `${user.displayAvatarURL()}` });
                        embedInfo.addFields(
                            { name: `${formatEmoji(settings.emojis.static.dot)} Insígnias do Discord`, value: `${badges}`, inline: false },
                        );
                    } else {
                        embedInfo.setTitle(`${user.globalName} ${badges}`);
                    }

                    embedInfo.addFields(
                        { name: `${formatEmoji(settings.emojis.static.user)} Nome`, value: codeBlock(`${user.username}`), inline: true },
                        { name: `${formatEmoji(settings.emojis.static.info)} Identidade`, value: codeBlock(`${user.id}`), inline: true },
                        { name: `${formatEmoji(settings.emojis.static.mention)} Menção`, value: `${user}`, inline: true },
                        { name: `${formatEmoji(settings.emojis.static.calendar)} Criou a conta em:`, value: `${time(createdAt!, "f")} (${time(createdAt!, "R")})`, inline: false }
                    );

                    if (banner) {
                        const extension = banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
                        const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;
                        embedInfo.setImage(url);
                    }

                    const member = guild.members.cache.get(user.id);
                    if (member) {

                        const joinedAt = member.joinedAt;

                        embedInfo.addFields(
                            { name: `${formatEmoji(settings.emojis.static.plus)} Entrou no servidor em:`, value: `${time(joinedAt!, "f")} (${time(joinedAt!, "R")})`, inline: false }
                        );
                    }

                    interaction.reply({
                        embeds: [embedInfo]
                    });

                });

                break;
            }
        }

    }
});
