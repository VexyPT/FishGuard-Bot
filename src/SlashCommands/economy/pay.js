const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pay",
    description: "Send money to another user",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "The user who will recive the money",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "amount",
            description: "The money ammount that you wanna send",
            type: ApplicationCommandOptionType.Number,
            min_value: 1,
            required: true
        }
    ],
    run: async(client, interaction) => {

        const sendUser = await client.userDB.findOne({ _id: interaction.user.id })
         || await client.userDB.create({ _id: interaction.user.id });

        const reciveUserMention = interaction.options.getUser("user");

        const reciveUser = await client.userDB.findOne({ _id: reciveUserMention.id })
         || await client.userDB.create({ _id: reciveUserMention.id });

        const moneyAmount = interaction.options.getNumber("amount");

        const embedConfirm = new EmbedBuilder()
        .setColor(`${client.color.green}`);

        const embedReject = new EmbedBuilder()
        .setColor(`${client.color.red}`);

        if (reciveUserMention == sendUser) {

            embedReject.setDescription(`> Sorry! you can't send money to yourself`)

            return interaction.reply({
                embeds: [embedReject],
                ephemeral: true
            });
        }

        if(sendUser.money < moneyAmount) {

            embedReject.setDescription(`> You don't have enough money to complete this transaction, you need another ${moneyAmount - sendUser.money} ${client.emoji.coin}`)

            return interaction.reply({
                embeds: [embedReject],
                ephemeral: true
            });
        }

        await client.userDB.updateOne({ _id: interaction.user.id }, {
            $inc: {
                money: - moneyAmount
            }
        }).then(async() => {
            await client.userDB.updateOne({ _id: reciveUserMention.id }, {
                $inc: {
                    money: moneyAmount
                }
            });
        });

        embedConfirm.setDescription(`> You have successfully sent ${moneyAmount} ${client.emoji.coin} to ${reciveUserMention}`)

        await interaction.reply({
            embeds: [embedConfirm]
        });

    }
}