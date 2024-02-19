module.exports = {
  name: "bank",
  description: "See how much money you have",
  run: async(client, message) => {

    const userDatabase = await client.userDB.findOne({
      _id: message.author.id
    })|| await client.userDB.create({ 
      _id: message.author.id 
    })

    await message.reply({
      content: `> Bank Account: ${userDatabase.money}$`
    })

  }
}