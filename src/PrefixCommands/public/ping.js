module.exports = {
  name: "ping",
  description: "Get ArtemisBot ping to discord!",
  run: async(client, message) => {

    await message.reply({ content: `${client.ws.ping}ms` });

  }
}