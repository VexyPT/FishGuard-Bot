const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "jobs",
  description: "Choose a Job",
  type: ApplicationCommandType.ChatInput,
  run: async(client, interaction) => {

    const userDatabase = await client.userDB.findOne({
        _id: interaction.user.id
      })|| await client.userDB.create({ 
        _id: interaction.user.id 
    });

    const jobs = {
        garbage_collector: {
            emoji: "🗑️",
            cooldown: 1000 * 60 * 45,
            maxMoney:  800
        },
        fisherman: {
            emoji: "🎣",
            cooldown: 1000 * 60 * 540,
            maxMoney: 1600
        },
        sedex_delivery: {
            emoji: "📦",
            cooldown: 1000 * 60 * 420,
            maxMoney: 2000
        },
        truck_driver: {
            emoji: "🚚",
            cooldown: 1000 * 60 * 300,
            maxMoney: 2500
        },
        game_developer: {
            emoji: "👾",
            cooldown: 1000 * 60 * 600
        }
    };

    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Click to show all the jobs available")
        .addOptions(
            Object.keys(jobs).map(job => {
                return {
                    label: job,
                    value: job,
                    emoji: jobs[job].emoji
                }
            })
        )
    );

    await interaction.reply({
        content: `> Choose a job`,
        components: [row]
    });

  }
}