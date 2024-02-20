module.exports = {
  name: "bank",
  description: "See how much money you have",
  run: async(client, message) => {

    const userDatabase = await client.userDB.findOne({
      _id: message.author.id
    })|| await client.userDB.create({ 
      _id: message.author.id 
    });

    const walletEmbed = new EmbedBuilder()
    .setColor(`${client.color.default}`)
    .setDescription(`${client.emoji.enterArrow} ${userDatabase.money} ${client.emoji.coin}`)
    .setThumbnail("https://cdn.discordapp.com/attachments/1070007620519333939/1207460602713473024/wallet-icon-on-transparent-background-free-png.png?ex=65dfba51&is=65cd4551&hm=879fef3a5ca9e90dcec82bd75bc06a69aacfd580861347119d9f342f2e1b5d41&")
    .setAuthor(
      { name: `${message.author.username}`, iconURL: `${message.author.avatarURL({ dynamic: true })}` }
    );

    await message.reply({
      embeds: [walletEmbed]
    });

  }
}