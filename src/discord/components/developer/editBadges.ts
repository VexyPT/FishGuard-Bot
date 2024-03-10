import { Component } from "#base";
import { ComponentType, EmbedBuilder, formatEmoji, StringSelectMenuBuilder } from "discord.js";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import { db } from "#database";

new Component({
    customId: "manageDev/user/:userId/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, params) {

        const { client } = interaction;
        const { action, userId } = params;
        const userDatabase = db.users.get(userId);
        const badges = (await userDatabase).badges;
        const userMention = await client.users.fetch(userId);

        switch(action){
            case "editBadges": {

                const embedEditBadges = new EmbedBuilder({
                    description: `Badges atuais de ${userMention}\n${formatEmoji(settings.emojis.static.dot)} ${badges.join(" ")}`,
                    color: hexToRgb(settings.colors.developer),
                    fields: [
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.dev)} Developer`,
                            value: "`Badge exclusiva para os Desenvolvedores da Kiara`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.moderator)} Moderador`,
                            value: "`Badge exclusiva para os Administradores/Moderadores da Kiara`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.staff)} Staff`,
                            value: "`Badge exclusiva para os Staff's da Kiara`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.bughunter)} Bug Hunter`,
                            value: "`Badge exclusiva para os Caçadores de Bugs da Kiara`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.partner)} Parceiro`,
                            value: "`Badge exclusiva para os Parceiros da Kiara`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.verified)} Verificado`,
                            value: "`Badge exclusiva para os membros notáveis no Discord`",
                            inline: true
                        },
                        {
                            name: `${formatEmoji(settings.emojis.static.economy.badges.premium)} Premium`,
                            value: "`Badge exclusiva para todos os usuários que possuem o premium da Kiara`",
                            inline: true
                        },
                    ]
                });

                const row = createRow(
                    new StringSelectMenuBuilder({
                        customId: `manageDev/user/${userId}/chooseBadge`,
                        minValues: 1,
                        maxValues: 8,
                        options: [
                            {
                                label: "Desenvolvedor",
                                emoji: `${settings.emojis.static.economy.badges.dev}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.dev)}`,
                            },
                            {
                                label: "Moderator",
                                emoji: `${settings.emojis.static.economy.badges.moderator}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.moderator)}`,
                            },
                            {
                                label: "Staff",
                                emoji: `${settings.emojis.static.economy.badges.staff}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.staff)}`,
                            },
                            {
                                label: "Bug Hunter",
                                emoji: `${settings.emojis.static.economy.badges.bughunter}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.bughunter)}`,
                            },
                            {
                                label: "Parceiro",
                                emoji: `${settings.emojis.static.economy.badges.partner}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.partner)}`,
                            },
                            {
                                label: "Verificado",
                                emoji: `${settings.emojis.static.economy.badges.verified}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.verified)}`,
                            },
                            {
                                label: "Premium",
                                emoji: `${settings.emojis.static.economy.badges.premium}`,
                                value: `${formatEmoji(settings.emojis.static.economy.badges.premium)}`,
                            },
                            {
                                label: "Remover Badges",
                                emoji: `${settings.emojis.static.error}`,
                                value: "removeBadges"
                            }
                        ]
                    })
                );

                interaction.update({ embeds: [embedEditBadges], components: [row] });

            } // fim do edit badges
        }

    },
});

new Component({
    customId: "manageDev/user/:userId/:action",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction, params) {

        const { values } = interaction;
        const { action, userId } = params;
        const userDatabase = db.users.get(userId);
        const badges = (await userDatabase).badges;

        switch(action){
            case "chooseBadge": {

                if (values[0] === "removeBadges") {
                    badges.splice(0, badges.length);
        
                    const updatedUser = await userDatabase;
                    updatedUser.badges = badges;
        
                    await updatedUser.save();
        
                    await interaction.reply({ content: "Badges removidas com sucesso", embeds: [], components: [], ephemeral });
                } else {
                    badges.length = 0;
                    badges.push(...values);
        
                    const updatedUser = await userDatabase;
                    updatedUser.badges = badges;
        
                    await updatedUser.save();
        
                    await interaction.reply({ content: "Badges setadas com sucesso", embeds: [], components: [], ephemeral });
                }

                break;
            }
        }

    },
});