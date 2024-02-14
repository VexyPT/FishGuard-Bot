const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

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

        if (!userDatabase && !userDatabase.work.workedWith) return interaction.reply({
            content: `> ${client.emoji.error} You don't have a job, please use the </jobs:1207305034493075477> command to get a job!`,
            ephemeral: true
        });

        if (Date.now() < userDatabase.cooldowns.work) return interaction.reply({
            content: `> ${client.emoji.error} You're very tired now! Wait a while before going back to work again`,
            ephemeral: true
        })



    }
}