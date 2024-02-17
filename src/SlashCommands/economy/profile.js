const { ApplicationCommandType, EmbedBuilder, codeBlock } = require("discord.js");

module.exports = {
    name: "profile",
    description: "See your profile",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        const userDatabase = await client.userDB.findOne({
            _id: interaction.user.id
          }) || await client.userDB.create({ _id: interaction.user.id });

        const profileEmbed = new EmbedBuilder()
        .setColor(client.color.default)
        .setAuthor(
            { 
                name: `${interaction.user.username} profile`,
                iconURL: `${interaction.user.avatarURL({ dynamic: true })}`
            }
        )
        .addFields(
            { name: "[] - Name", value: `${codeBlock(interaction.user.displayName)}`, inline: true },
            { name: "[] - ID", value: `${codeBlock(interaction.user.id)}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: `[] - Level`, value: `${codeBlock("0")}`, inline: true },
            { name: `[] - XP`, value: `${codeBlock("0")}`, inline: true },
            { name: `[] - About`, value: `${codeBlock("Use /aboutme to change this text")}`, inline: false },
            { name: `[] - Bank`, value: `${codeBlock("0")}`, inline: true},
            { name: `[] - Wallet`, value: `${codeBlock(userDatabase.money)}`, inline: true },
        )

        interaction.reply({ embeds: [profileEmbed] })

    }
}