import { Command } from "#base";
import { ApplicationCommandType, ApplicationCommandOptionType, ChannelType, TextChannel, PermissionFlagsBits } from "discord.js";
import { db } from "#database";

new Command({
    name: "security",
    description: "gerenciamento do modulo security",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: "block-phishing-links",
            description: "「Bot」Protect the server from phishing links.",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "activate",
                    description: "Configure channels for the bot.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Configure the channel where the bot will send the logs.",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required: true
                        },
                    ]
                },
                {
                    name: "desactivate",
                    description: "Desactivate the anti-phishing protection",
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        }
    ],
    async run(interaction){

        const { options, guild } = interaction;

        switch(options.getSubcommand()){
            case "activate": {
                const channel = options.getChannel("channel") as TextChannel;

                const guildData = await db.guilds.get(guild.id);

                guildData.securitySystem = {
                    systemStatus: true,
                    channels: {
                        logs: channel.id
                    }
                };

                guildData.save();

                await interaction.reply({
                    content: "✅Sistema configurado"
                });

                break;
            }
            case "desactivate": {
                const guildData = await db.guilds.get(guild.id);

                guildData.securitySystem = {
                    systemStatus: false
                };

                guildData.save();

                await interaction.reply({
                    content: "✅Sistema desativado"
                });
                
                break;
            }
        }


        
    }
});