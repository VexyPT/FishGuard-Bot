const { Client, Collection, Partials, GatewayIntentBits, WebhookClient, EmbedBuilder } = require('discord.js');
const handler = require('./src/handler/index.js');
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const client = new Client({
  intents: [ GatewayIntentBits.Guilds ]
});

module.exports = client;

client.color = require('./settings/colors.json');
client.emoji = require('./settings/emojis.json');
client.webhook = require('./settings/webhooks.json');
client.userDB = require('./src/Schemas/User.js');
client.commands = new Collection();
client.slash = new Collection();
client.config = require('./config.json');

handler.loadEvents(client);
handler.loadCommands(client);
handler.loadSlashCommands(client);

// Webhook command logs
const webhookUrl = client.webhook.commandLogs;
const webhookClient = new WebhookClient({ url: webhookUrl });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

// Commands args
  const args = interaction.options._hoistedOptions.map((option) => {
    return `${option.name}: ${option.value}`;
  });

  let logMessage = new EmbedBuilder()
  .setColor(client.color.default)
  .setTitle("🛡️ Comando executado")
  .setDescription(`> 🛰️ **Nome do comando:** \`${interaction.commandName}\`
  > 👤 **Executado por:** \`${interaction.user.tag}\` - \`${interaction.user.id}\`
  > 🗺️ **Servidor:** \`${interaction.guild.name}\`
  > 💡 **Argumentos:**  \`${args.join(' | ')}\``)

  webhookClient.send({ embeds: [logMessage] });
});

// Check if the .env.development file exists
let tokenFile = ".env";
if (fs.existsSync('.env.development')) {
  tokenFile = '.env.development';
}

// Loads the environment variables from the corresponding .env file
const result = dotenv.config({
  path: tokenFile
});

// Checks if there was an error loading the environment variables
if (result.error) {
  console.error("Erro ao carregar as variáveis de ambiente: ", result.error);
  process.exit(1);
}

// Adds event listeners for error handling
process.on("uncaughtException", (err) => {
	console.log("Error: Uncaught Exception:\n" + err);
});
process.on("unhandledRejection", (reason, promise) => {
    console.log("Error: unhandledRejection:\n" + reason.message);
});

// Login with token loaded
client.login(process.env.clientToken);

// Connect to MongoDB Database
mongoose.connect(process.env.mongoDB)
    .then(() => { console.log("MongoDB - Database Connected") });