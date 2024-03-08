import { Command } from "#base";
import { settings } from "#settings";
import { brBuilder } from "@magicyan/discord";
import { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, formatEmoji, codeBlock } from "discord.js";

new Command({
    name: "clear",
    description: "「Moderação」 Delete an amount of messages from a user or channel",
    descriptionLocalizations: {
        "pt-BR": "「Moderação」 Delete uma quantia de mensagens de algum usuário ou canal"
    },
    dmPermission: false,
    defaultMemberPermissions: ["ManageMessages"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "quantidade",
            description: "Quantidade de mensagens a serem limpas",
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            maxValue: 100
        },
        {
            name: "autor",
            description: "Limpar mensagens de apenas um autor",
            type: ApplicationCommandOptionType.User
        },
        {
            name: "mensagem",
            description: "Deletar uma mensagem específica do canal",
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        }
    ],
    async autocomplete(interaction) {
        const { options, channel } = interaction;
        const focused = options.getFocused(true);

        switch(focused.name) {
            case "mensagem": {
                if (!channel?.isTextBased()) return;
                const messages = await channel.messages.fetch();
                const choices = Array.from(messages)
                    .map(([id, { content, author, createdAt }]) => {
                        const time = createdAt.toLocaleTimeString("pt-BR");
                        const [hour, minute] = time.split(":");
                        const text = `${hour}:${minute} ${author.displayName}: ${content}`;
                        const name = text.length > 90 ? text.slice(0, 90) + "..." : text;
                        return { name, value: id };
                    });

                const filterd = choices.filter(c => c.name.toLocaleLowerCase().includes(focused.value.toLocaleLowerCase()));
                interaction.respond(filterd.slice(0, 25));
                return;
            }
        }
    },
    async run(interaction){
        
        const { options, channel, user } = interaction;

        if (!channel?.permissionsFor(user)?.has(PermissionFlagsBits.ManageMessages)) {
            interaction.editReply({
                content: `${formatEmoji(settings.emojis.static.error)} Você não tem permissão para usar este comando! Para utilizá-lo, você precisa ter permissão para \`Gerenciar Mensagens\`!`
            });
            return;
        }

        if (!channel?.isTextBased()) {
            interaction.editReply({ content: `${formatEmoji(settings.emojis.static.error)} Não é possível utilizar este comando nesse canal!` });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const amount = options.getInteger("quantidade") || 1;
        const mention = options.getMember("autor");
        const messageId = options.getString("mensagem");

        if (messageId) {
            channel.messages.delete(messageId)
                .then(() => interaction.editReply({
                    content: `${formatEmoji(settings.emojis.static.check)} A mensagem foi deletada com sucesso`
                }))
                .catch((err) => interaction.editReply({
                    content: brBuilder(`${formatEmoji(settings.emojis.static.error)} Não foi possível deletar a mensagem`, codeBlock("ts", err))
                }));
            return;
        }

        if (mention) {
            const messages = await channel.messages.fetch();
            const filtered = messages.filter(m => m.author.id == mention.id);
            channel.bulkDelete(filtered.first(Math.min(amount, 100)))
                .then(cleared => interaction.editReply({
                    content: cleared.size
                        ? `${formatEmoji(settings.emojis.static.check)} Foram deletadas \`${cleared.size}\` mensagens com sucesso de ${mention}!`
                        : `${formatEmoji(settings.emojis.static.error)} Não há mensagens de ${mention} para serem deletadas!`,
                }))
                .catch((err) => interaction.editReply({
                    content: brBuilder("Não foi possível deletar mensagens!", codeBlock("ts", err))
                }));
            return;
        }

        channel.bulkDelete(Math.min(amount, 100))
            .then(cleared => interaction.editReply({
                content: cleared.size
                    ? `${formatEmoji(settings.emojis.static.check)} Foram deletadas \`${cleared.size}\` mensagens sucesso!`
                    : `${formatEmoji(settings.emojis.static.error)} Não há mensagens para serem deletadas!`,
            }))
            .catch((err) => interaction.editReply({
                content: brBuilder(`${formatEmoji(settings.emojis.static.error)} Não foi possível deletar mensagens!`, codeBlock("ts", err))
            }));

    }
});