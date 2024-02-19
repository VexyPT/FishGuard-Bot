const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "daily",
  description: "Claim your daily reward",
  type: ApplicationCommandType.ChatInput,
  run: async(client, interaction) => {

    const userDatabase = await client.userDB.findOne({
      _id: interaction.user.id
    }) || await client.userDB.create({ _id: interaction.user.id });

    const embedConfirm = new EmbedBuilder()
    .setColor(`${client.color.green}`);

    const embedReject = new EmbedBuilder()
    .setColor(`${client.color.red}`);

    if (userDatabase.cooldowns.daily < Date.now()) {
      const Amount = Math.floor(Math.random() * 250 + 50); // I put "+ 50" so that the minimum is 50

      await client.userDB.updateOne({ _id: interaction.user.id }, {
        $inc: {
          money: Amount
        }
      });

      await client.userDB.updateOne({ _id: interaction.user.id }, {
        $set: {
          "cooldowns.daily": Date.now() + 86400 * 1000 // 1 day in seconds
        }
      });

      embedConfirm.setDescription(`> You have successfully redeemed your daily reward and received ${Amount} ${client.emoji.coin}`);

      await interaction.reply({
        embeds: [embedConfirm]
      });
    } else {

      embedReject.setDescription(`> You still can't redeem your daily reward, back in <t:${Math.floor(userDatabase.cooldowns.daily / 1000)}:R>`);

      await interaction.reply({
        embeds: [embedReject],
        ephemeral: true
      });
    }

  }
}