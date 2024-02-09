module.exports = {
  name: "daily",
  description: "Claim your daily reward",
  run: async(client, message) => {

    const userDatabase = await client.userDB.findOne({
      _id: message.author.id
    }) || await client.userDB.create({
      _id: message.author.id
    })

    if (userDatabase.cooldowns.daily < Date.now()) {
      const Amount = Math.floor(Math.random() * 300)

      await client.userDB.updateOne({
        _id: message.author.id,
      }, {
        $inc: {
          money: Amount
        }
      });

      await client.userDB.updateOne({
        _id: message.author.id,
      }, {
        $set: {
          "cooldowns.daily": Date.now() + 1000 * 60 * 60 * 24
        }
      });

      await message.reply({
        content: `> You have successfully redeemed your daily reward and received **\`${Amount} $\`**`
      })
    } else {
      await message.reply({
        content: `> You still can't redeem your daily reward,back in <t:${Math.floor(userDatabase.cooldowns.daily / 1000)}:R>`,
      })
    }

  }
}