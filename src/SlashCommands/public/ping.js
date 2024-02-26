const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get Butter ping to discord!",
  type: ApplicationCommandType.ChatInput,
  run: async(client, interaction) => {

    let circles = {
      good: "✅",
      okay: "⚠",
      bad: "❗"
    };

    await interaction.deferReply({ ephemeral: true });

    const pinging = await interaction.editReply({ content: 'Pinging...' });

    const ws = client.ws.ping; // websocket
    const msgEdit = Date.now() - pinging.createdTimestamp; // Api latency

    // Uptime
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
    const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

    const pingEmbed = new EmbedBuilder()
    .setThumbnail(`${client.user.displayAvatar({ size: 64 })}`)
    .setColor(`${client.colors.default}`)
    .setFooter({ text: `Pinged At` })
    .setTimestamp(new Date().toISOString())
    .addFields(
      { name: "Websocket", value: `${wsEmoji} \`${ws}ms\`` },

      { name: "API latency", value: `${msgEmoji} \`${msgEdit}ms\`` },

      { name: `${client.user.username} Uptime`, 
      value: `\`${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos\``
      },
    );

    await pinging.edit({ embeds: [pingEmbed], content: '\u200b'});

  }
}