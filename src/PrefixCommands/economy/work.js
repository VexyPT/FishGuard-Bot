const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "work",
    description: "Work on a job",
    run: async(client, message) => {

        const userDatabase = await client.userDB.findOne({
            _id: message.author.id
          })|| await client.userDB.create({ 
            _id: message.author.id 
        });

        if (!userDatabase || !userDatabase.work.workedWith) {
            return message.reply({
                content: `> ${client.emoji.error} You don't have a job, please use the </jobs:1207305034493075477> or k!jobs command to get a job!`
            });
        }

        if (userDatabase.cooldowns.work < Date.now()) {

            const calc = userDatabase.work.maxMoney / 2

            const money = Math.floor(Math.random() * calc) + calc;

            await client.userDB.updateOne({
                _id: interaction.user.id
            }, {
                $inc: {
                    money: money
                },
                $set: {
                    cooldowns: {
                        work: Date.now() + userDatabase.work.jobCooldown
                    }
                }
            });

            const workMappings = {
                garbageCollector: "Garbage Collector",
                fisherman: "Fisherman",
                sedexDelivery: "Sedex Delivery",
                truckDriver: "Truck Driver",
                gameDeveloper: "Game Developer",
                pizzaDelivery: "Pizza Delivery"
            }

            const workName = workMappings[userDatabase.work.workedWith] || userDatabase.work.workedWith;

            const embedJobDone = new EmbedBuilder()
            .setDescription(`> You worked as a ${workName} and got paid ${money} ${client.emoji.coin}`)
            .setColor(`${client.color.green}`);

            await message.reply({
                embeds: [embedJobDone]
            });

        } else {

            const embedTired = new EmbedBuilder()
            .setDescription(`> ${client.emoji.error} You're very tired now! Wait a while before going back to work again, you can go back to work <t:${Math.floor(userDatabase.cooldowns.work / 1000)}:R>`)
            .setColor(`${client.color.red}`);

            return message.reply({
                embeds: [embedTired]
            });
        }

    }
}