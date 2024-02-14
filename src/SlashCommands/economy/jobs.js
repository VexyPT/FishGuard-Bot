const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ms = require("ms");

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
        garbageCollector: {
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
        sedexDelivery: {
            name: "Sedex Delivery",
            emoji: "📦",
            cooldown: 1000 * 60 * 420,
            description: "Deliver packages",
            maxMoney: 2000
        },
        truckDriver: {
            name: "Truck Driver",
            emoji: "🚚",
            cooldown: 1000 * 60 * 300,
            description: "Drive and drive for hours to deliver some chicken feed to companies",
            maxMoney: 2500
        },
        gameDeveloper: {
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
                    label: jobs[job].name,
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

                const work = i.values[0];

                const embedJob = new EmbedBuilder()
                .setTitle(`${jobs[work].name} ${jobs[work].emoji}`)
                .addFields(
                    { name: `> **Description:**`, value: `\`${jobs[work].description}\``},
                    { name: `> **Cooldown:**`, value: `\`${ms(jobs[work].cooldown)}\``},
                    { name: `> **Max Salary:**`, value: `\`${jobs[work].maxMoney + 500}$\``}
                )

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId(`accept_${work}`)
                    .setEmoji("✅")
                    .setLabel("Accept Job")
                    .setStyle(ButtonStyle.Secondary)
                );                
                
                i.update({
                    content: ``,
                    embeds: [embedJob],
                    components: [button]
                });
            }

            if (i.isButton()) {
                const [, work] = i.customId.split("_");

                if (work == userDatabase.work.workedWith) return i.update({
                    content: `> Bro, that's already your job, wake up!`,
                    components: [],
                    embeds: []
                });

                i.update({
                    content: `> Congratulations! You now work as a ${work}`,
                    components: [],
                    embeds: []
                });

                await client.userDB.updateOne({
                    _id: interaction.user.id
                }, {
                    $set: {
                        work: {
                            maxMoney: jobs[work].maxMoney,
                            workedWith: work,
                            cooldown: jobs[work].cooldown
                        }
                    }
                });


            }

            //if () {}
        })
    })

  }
}