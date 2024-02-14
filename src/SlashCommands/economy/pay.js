const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

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

        if (reciveUserMention == sendUser) {
            return interaction.reply({
                content: `> Sorry! you can't send money to yourself`,
                ephemeral: true
            });
        }

        if(sendUser.money < moneyAmount) {
            return interaction.reply({
                content: `> You don't have enough money to complete this transaction, you need another **\`${moneyAmount - sendUser.money}$\`**`,
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

        await interaction.reply({
            content: `> You have successfully sent ${moneyAmount}$ to ${reciveUserMention}`
        });

    }
}