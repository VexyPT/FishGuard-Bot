const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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
            name: "Garbage Collector",
            emoji: "🗑️",
            cooldown: 1000 * 60 * 45,
            description: "Collect trash from the streets",
            maxMoney:  800
        },
        fisherman: {
            name: "Fisherman",
            emoji: "🎣",
            cooldown: 1000 * 60 * 540,
            description: "Go fish with your dad (if you have one)",
            maxMoney: 1600
        },
        sedex_delivery: {
            name: "Sedex Delivery",
            emoji: "📦",
            cooldown: 1000 * 60 * 420,
            description: "Deliver packages",
            maxMoney: 2000
        },
        truck_driver: {
            name: "Truck Driver",
            emoji: "🚚",
            cooldown: 1000 * 60 * 300,
            description: "Drive and drive for hours to deliver some chicken feed to companies",
            maxMoney: 2500
        },
        game_developer: {
            name: "Game Developer",
            emoji: "👾",
            cooldown: 1000 * 60 * 600,
            description: "Make games with GDScript, or bugs, you choose",
            maxMoney: 7000
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
        components: [row], ephemeral: true, fetchReply: true
    }).then(msg => {
        const collector = msg.createMessageComponentCollector({ idle: 1000 * 60 * 1});

        collector.on("collect", async i => {
            if (i.isStringSelectMenu()) {

                const convertCooldownToTimestamp = (milliseconds) => {
                    const seconds = Math.floor(milliseconds / 1000);
                    return `<t:${seconds}:R>`;
                };
                
                const embedJob = new EmbedBuilder()
                .setTitle(`${jobs[work].name} ${jobs[work].emoji}`)
                .addFields(
                    { name: `> **Description:**`, value: `\`${jobs[work].description}\``},
                    { name: `> **Cooldown:**`, value: `\`${convertCooldownToTimestamp(jobs[work].cooldown)}\``},
                    { name: `> **Max Salary:**`, value: `${jobs[work].maxMoney + 500}`}
                )

                const work = i.values[0];

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId(`accept_${work}`)
                    .setEmoji(jobs[work].emoji)
                    .setLabel("Accept Job")
                    .setStyle(ButtonStyle.Secondary)
                );                
                
                i.update({
                    content: ``,
                    embeds: [embedJob],
                    components: [button]
                });
            }
        })
    })

  }
}