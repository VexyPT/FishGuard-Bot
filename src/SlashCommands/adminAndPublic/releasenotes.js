const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const notes = require("../../Schemas/releasenotes.js");

module.exports = {
    name: "release-notes",
    description: "Add a release note",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "publish",
            description: "Add new release notes (developers only)",
            options: [
                {
                    name: "updated-notes",
                    description: "The notes to publish",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "version",
                    description: "The release version",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }, {
            name: "view",
            description: "View the most recent release notes",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    run: async(client, interaction) => {

        const sub = interaction.options.getSubcommand();
        var data = await notes.find();

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        async function updateNotes(update, version) {
            await notes.create({
                Updates: update,
                Date: Date.now(),
                Developer: interaction.user.username,
                Version: version
            });

            await sendMessage(`🌍 I have updated your release notes`);
        }

        switch (sub) {
            case 'publish':
                if (interaction.user.id !== '435877436459188234') {
                    await sendMessage(`⚠️ Sorry! Looks like only developers can use this!`);
                } else {
                    const update = interaction.options.getString('updated-notes').replace(/\\n/g, "\n")
                    if (data.length > 0) {
                        await notes.deleteMany();

                        var version = interaction.options.getString('version');
                        
                        await updateNotes(`${update}`, version);
                    } else {
                        await updateNotes(`${update}`, 1.0);
                    }
                }
            break;
            case 'view':
                if (data.length == 0) {
                    await sendMessage(`⚠️ There is no public release notes yet...`);
                } else {
                    var string = ``;
                    await data.forEach(async value => {
                        string += `\`${value.Version}\` \n\n**Update Information:**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`;
                    });

                    await sendMessage(`🌍 **Release Notes** ${string}`);
                }
        }

    }
}