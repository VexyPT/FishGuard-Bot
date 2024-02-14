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
            maxMoney:  300
        },
        fisherman: {
            name: "Fisherman",
            emoji: "🎣",
            cooldown: 1000 * 60 * 540,
            description: "Go fish with your dad (if you have one)",
            maxMoney: 1100
        },
        sedexDelivery: {
            name: "Sedex Delivery",
            emoji: "📦",
            cooldown: 1000 * 60 * 420,
            description: "Deliver packages",
            maxMoney: 1500
        },
        truckDriver: {
            name: "Truck Driver",
            emoji: "🚚",
            cooldown: 1000 * 60 * 300,
            description: "Drive and drive for hours to deliver some chicken feed to companies",
            maxMoney: 2000
        },
        gameDeveloper: {
            name: "Game Developer",
            emoji: "👾",
            cooldown: 1000 * 60 * 600,
            description: "Make games with GDScript, or bugs, you choose",
            maxMoney: 6500
        },
        pizzaDelivery: {
            name: "Pizza Delivery",
            emoji: "🍕",
            cooldown: 1000 * 60 * 45,
            description: "Domino's pizza delevery guy",
            maxMoney: 500
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
                    .setEmoji(`${client.emoji.check}`)
                    .setLabel("Accept Job")
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId(`reject_job`)
                    .setEmoji(`${client.emoji.error}`)
                    .setLabel("Reject Job")
                    .setStyle(ButtonStyle.Secondary)
                );                
                
                i.update({
                    content: ``,
                    embeds: [embedJob],
                    components: [button]
                });
            }

            if (i.isButton() && i.customId.startsWith("accept_")) {

                if (userDatabase.cooldowns.changeJob < Date.now()) {
                    const [, work] = i.customId.split("_");

                    const workMappings = {
                        garbageCollector: "Garbage Collector",
                        fisherman: "Fisherman",
                        sedexDelivery: "Sedex Delivery",
                        truckDriver: "Truck Driver",
                        gameDeveloper: "Game Developer",
                        pizzaDelivery: "Pizza Delivery"
                    }

                    const workName = workMappings[work] || work;

                    if (work == userDatabase.work.workedWith) return i.update({
                        content: `> That's already your job.`,
                        components: [],
                        embeds: []
                    });

                    i.update({
                        content: `> Congratulations! You now work as a ${workName}`,
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
                            },
                            cooldowns: {
                                work: jobs[work].cooldown,
                                changeJob: Date.now() + 86400 * 1000
                            }
                        }
                    });
                } else {
                    return i.update({
                        content: `> ${client.emoji.error} You recently changed your job, you can change again <t:${Math.floor(userDatabase.cooldowns.changeJob / 1000)}:R>`,
                        embeds: [],
                        components: [],
                    })
                }

            } else if (i.isButton() && i.customId == "reject_job") {
                i.update({
                    content: `> Choose a job`,
                    components: [row], ephemeral: true, fetchReply: true
                });
            }
        })
    })

  }
}