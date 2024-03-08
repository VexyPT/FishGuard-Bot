import { Command, Modal } from "#base";
import { settings } from "#settings";
import { brBuilder, createModalInput, createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, Attachment, Collection,
    ApplicationCommandOptionType, ChannelType, formatEmoji,
    PermissionFlagsBits, 
    ModalBuilder,
    TextInputStyle,
    ComponentType,
    EmbedBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextChannel,
    codeBlock } from "discord.js";

interface MessageProps {
    content: string,
    channelId: string,
    image: Attachment | null,
    thumbnail: Attachment | null,
    color: string
}

const members: Collection<string, MessageProps> = new Collection();

new Command({
    name: "embed-create",
    nameLocalizations: {
        "pt-BR": "criar-embed"
    },
    description: "Create a custom embned",
    descriptionLocalizations: {
        "pt-BR": "Crie uma embed personalizada"
    },
    dmPermission: false,
    defaultMemberPermissions: ["ManageMessages"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "channel",
            nameLocalizations: {
                "pt-BR": "canal",
            },
            description: "Channel where the announcement will be sent",
            descriptionLocalizations: {
                "pt-BR": "Canal onde o anúncio será enviado",
            },
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText,ChannelType.GuildAnnouncement],
            required: true
        },
        {
            name: "color",
            nameLocalizations: {
                "pt-BR": "cor"
            },
            description: "embed color",
            descriptionLocalizations: {
                "pt-BR": "Cor da embed"
            },
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Yellow", nameLocalizations: { "pt-BR": "Amarelo" }, value: "#fde047" },
                { name: "Green", nameLocalizations: { "pt-BR": "Verde" }, value: "#22c55e" },
                { name: "Blue", nameLocalizations: { "pt-BR": "Azul" }, value: "#3b82f6" },
                { name: "Red", nameLocalizations: { "pt-BR": "Vermelho" }, value: "#ef4444" },
                { name: "Invisible", nameLocalizations: { "pt-BR": "Invisível" }, value: "#2F3136" },
            ],
            required: true
        },
        {
            name: "content",
            nameLocalizations: {
                "pt-BR": "conteudo"
            },
            description: "Content (text outside of the embed)",
            descriptionLocalizations: {
                "pt-BR": "Conteudo fora da embed"
            },
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "image",
            nameLocalizations: {
                "pt-BR": "imagem"
            },
            description: "Embed Image",
            descriptionLocalizations: {
                "pt-BR": "Imagem da embed"
            },
            type: ApplicationCommandOptionType.Attachment,
            required: false
        },
        {
            name: "thumbnail",
            nameLocalizations: {
                "pt-BR": "thumbnail"
            },
            description: "embeds's thumbnail",
            descriptionLocalizations: {
                "pt-BR": "Miniatura no cantinho da embed"
            },
            type: ApplicationCommandOptionType.Attachment,
            required: false
        }
    ],
    async run(interaction) {

        const { options, member, user } = interaction;

        if (!interaction.channel?.permissionsFor(user)?.has(PermissionFlagsBits.ManageMessages)) {
            interaction.reply({
                content: `${formatEmoji(settings.emojis.static.error)} Você precisa da permissão \`Manage Messages\`(Gerenciar Mensagens) para utilizar este comando.`,
                ephemeral
            });
            return;
        }

        const channel = options.getChannel("channel", true);
        const color = options.getString("color", true);
        const content = options.getString("content") || "";
        const image = options.getAttachment("image");
        const thumbnail = options.getAttachment("thumbnail");

        members.set(member.id, { content, channelId: channel.id, color, image, thumbnail });

        interaction.showModal(new ModalBuilder({
            customId: "createEmbed",
            title: "Fazer um anúncio",
            components: [
                createModalInput({
                    customId: "createEmbed-title-input",
                    label: "Título",
                    placeholder: "Insira o título",
                    style: TextInputStyle.Short,
                    maxLength: 256,
                }),
                createModalInput({
                    customId: "createEmbed-description-input",
                    label: "Descrição",
                    placeholder: "Insira a descrição",
                    style: TextInputStyle.Paragraph,
                    maxLength: 4000,
                })
            ]
        }));
        
    }
});

new Modal({
    customId: "createEmbed",
    cache: "cached",
    async run(interaction) {

        const { fields, guild, member } = interaction;

        const MessageProps = members.get(member.id);
        if (!MessageProps) {
            interaction.reply({ephemeral,
                content: "Não foi possível obter os dados iniciais! Utilize o comando novamente."
            });
            return;
        }

        const title = fields.getTextInputValue("createEmbed-title-input");
        const description = fields.getTextInputValue("createEmbed-description-input");

        let urlImage = "attachment://image.png";
        if (MessageProps && MessageProps.image?.url.endsWith(".gif")) urlImage = "attachment://image.gif";

        const embed = new EmbedBuilder({ title, description,
            color: hexToRgb(MessageProps.color),
            image: { url: urlImage },
            thumbnail: { url: MessageProps.thumbnail?.url as string}
        });

        await interaction.deferReply({ ephemeral, fetchReply });

        const files: AttachmentBuilder[] = [];

        if (MessageProps.image){
            files.push(new AttachmentBuilder(MessageProps.image.url, { name: urlImage.slice(13) }));
        }

        const message = await interaction.editReply({
            content: `${MessageProps.content}`,embeds: [ embed ], files,
            components: [
                createRow(
                    new ButtonBuilder({
                        customId: "createEmbed-confirm-button", style: ButtonStyle.Success,
                        label: "Confirmar", emoji: settings.emojis.static.check,
                    }),
                    new ButtonBuilder({
                        customId: "createEmbed-cancel-button", style: ButtonStyle.Danger,
                        label: "Cancelar", emoji: settings.emojis.static.error,
                    }),
                )
            ]
        });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
        collector.on("collect", async (SubInteraction) => {
            const { customId } = SubInteraction;
            collector.stop();

            if (customId === "createEmbed-cancel-button"){
                SubInteraction.update({ embeds, components, files,
                    content: "Ação cancelada!"
                });
                return;
            }
            await SubInteraction.deferUpdate();

            const channel = guild.channels.cache.get(MessageProps.channelId) as TextChannel;

            channel.send({ content: `${MessageProps.content}`, embeds: [embed], files })
            .then((msg) => {
                interaction.editReply({ components, embeds, files: [],
                    content: `${formatEmoji(settings.emojis.static.check)} Mensagem enviada com sucesso! Confira: ${msg.url}`
                });
            })
            .catch(err => {
                interaction.editReply({ components, embeds, files,
                    content: brBuilder(`${formatEmoji(settings.emojis.static.error)} Não foi possível enviar a mensagem`, codeBlock("bash", err))
                });
            });

            members.delete(member.id);
        });

    }
});