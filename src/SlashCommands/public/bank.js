const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "bank",
  description: "See how much money you have",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "ephemeral",
        description: "Wanna hide your money?",
        type: ApplicationCommandOptionType.Boolean,
        required: false
    }
  ],
  run: async(client, interaction) => {

    const hideOrNot = interaction.options.getBoolean("ephemeral");

    const userDatabase = await client.userDB.findOne({
      _id: interaction.user.id
    })|| await client.userDB.create({ 
      _id: interaction.user.id 
    })

    await interaction.reply({
      content: `> Bank Account: ${userDatabase.money}$`,
      ephemeral: hideOrNot
    })

  }
}