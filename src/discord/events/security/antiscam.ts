import { Event } from "#base";
import { db } from "#database";
import { ChannelType } from "discord.js";

new Event({
    name: "Anti Scam",
    event: "messageCreate",
    async run(message) {

        const { client } = message;

        if (message.author.id == client.user.id) return;
        const guildId = message.guild!.id; 
        if (!guildId) return;
        console.log("Teste 1 - Passou");
        const guildData = await db.guilds.get(guildId);
        console.log("Teste 2 - Passou");
        if (!guildData.securitySystem?.systemStatus) return;

        const regexBlockDomainShortlinks = /(?:https?:\/\/(?:www\.)?)?(surl\.li|u\.to|t\.co|gclnk\.com|qptr\.ru|uclck\.ru|go-link\.ru|envs\.sh|shorter\.me|sc\.link|goo\.su)\/\S*link\S*/gi;
        
        if (regexBlockDomainShortlinks.test(message.content)) {
            await db.security.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });

            await message.delete();

            try {
                const member = message.guild?.members.cache.get(message.author.id);
                if (member) {
                    await member.kick("Sent a malicious link");
                }
            } catch (error) {
                console.log("An error occurred while trying to kick the user:", error);
            }
            const logChannelId = guildData.securitySystem.channels?.logs;
            if (logChannelId) {
                const logChannel = message.guild?.channels.cache.get(`${logChannelId}`);
                if (logChannel && logChannel.type === ChannelType.GuildText) {
                    await logChannel.send(`🔨 Phishing URL sent by ${message.author} (**${message.author.username}**, \`${message.author.id}\`). Actions: \`DELETE\`,\`KICK\`\n> \`${message.content}\``);
                } else {
                    console.log("An error occurred while sending a message to the log channel");
                }
            } else {
                console.log("No log channel configured for this server.");
            }
        }
    },
});
