const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "wallet",
  description: "See how much money you have in your wallet  ",
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
    });

    const walletEmbed = new EmbedBuilder()
    .setColor(`${client.color.default}`)
    .setDescription(`${client.emoji.enterArrow} ${userDatabase.money} ${client.emoji.coin}`)
    .setThumbnail("https://cdn.discordapp.com/attachments/1070007620519333939/1207460602713473024/wallet-icon-on-transparent-background-free-png.png?ex=65dfba51&is=65cd4551&hm=879fef3a5ca9e90dcec82bd75bc06a69aacfd580861347119d9f342f2e1b5d41&")
    .setAuthor(
      { name: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` }
    );

    await interaction.reply({
      embeds: [walletEmbed],
      ephemeral: hideOrNot
    });

  }
}