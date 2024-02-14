const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "work",
    description: "Do your job",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        
        const userDatabase = await client.userDB.findOne({
            _id: interaction.user.id
          })|| await client.userDB.create({ 
            _id: interaction.user.id 
        });

        if (!userDatabase || !userDatabase.work.workedWith) {
            return interaction.reply({
                content: `> ${client.emoji.error} You don't have a job, please use the </jobs:1207305034493075477> command to get a job!`,
                ephemeral: true
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

            await interaction.reply({
                embeds: [embedJobDone]
            });

        } else {

            const embedTired = new EmbedBuilder()
            .setDescription(`> ${client.emoji.error} You're very tired now! Wait a while before going back to work again <t:${Math.floor(userDatabase.cooldowns.work / 1000)}:R>`)
            .setColor(`${client.color.red}`);

            return interaction.reply({
                embeds: [embedTired],
                ephemeral: true
            });
        }


    }
}