import { Component } from "#base";
import { ComponentType, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";

new Component({
    customId: "avatar/user/:userId/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, params) {

        const { action, userId } = params;
        const { client } = interaction;

        switch(action){
            case "global": {

                const targetMember = await client.users.fetch(userId);
                
                const embedAvatar = new EmbedBuilder({
                    author: { name: `${targetMember.displayName}`, iconURL: targetMember.displayAvatarURL() },
                    image: { url: targetMember.displayAvatarURL({ size: 1024 }) },
                    color: hexToRgb(settings.colors.azoxo)
                });
        
                const row = createRow(
                    new ButtonBuilder({
                        customId: `avatar/user/${targetMember.id}/global`,
                        label: "Avatar Global",
                        style: ButtonStyle.Secondary
                    }),
                    new ButtonBuilder({
                        customId: `avatar/user/${targetMember.id}/server`,
                        label: "Avatar do Servidor",
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        url: `${targetMember.displayAvatarURL({ size: 1024 })}`,
                        label: "Download",
                        style: ButtonStyle.Link
                    })
                );
                
                await interaction.update({ embeds: [embedAvatar], components: [row] });

                break;
            }
            case "server": {

                const targetMember = await interaction.guild.members.fetch(userId);

                const embedAvatar = new EmbedBuilder({
                    title: "Avatar do Servidor",
                    author: { name: `${targetMember.displayName}`, iconURL: targetMember.displayAvatarURL() },
                    image: { url: targetMember.displayAvatarURL({ size: 1024 }) },
                    color: hexToRgb(settings.colors.azoxo)
                });
        
                const row = createRow(
                    new ButtonBuilder({
                        customId: `avatar/user/${targetMember.id}/global`,
                        label: "Avatar Global",
                        style: ButtonStyle.Secondary
                    }),
                    new ButtonBuilder({
                        customId: `avatar/user/${targetMember.id}/server`,
                        label: "Avatar do Servidor",
                        style: ButtonStyle.Primary
                    }),
                    new ButtonBuilder({
                        url: `${targetMember.displayAvatarURL({ size: 1024 })}`,
                        label: "Download",
                        style: ButtonStyle.Link
                    })
                );
                
                await interaction.update({ embeds: [embedAvatar], components: [row] });

                break;
            }
        }

    },
});