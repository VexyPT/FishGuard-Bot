const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get ArtemisBot ping to discord!",
  type: ApplicationCommandType.ChatInput,
  run: async(client, interaction) => {

    await interaction.reply({ content: `> ${client.ws.ping}ms`, ephemeral: true });

  }
}