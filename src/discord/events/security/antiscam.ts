import { Event } from "#base";
import { db } from "#database";
import { ChannelType } from "discord.js";

new Event({
    name: "Anti-Scam",
    event: "messageCreate",
    async run(message) {
        const guildId = message.guild?.id; 

        // Check if the server ID is available and if there's a record for this server in the database
        if (!guildId) return;
        
        const guildData = await db.guilds.get(guildId);
        // Check if the security system is enabled for this server
        if (!guildData.securitySystem?.systemStatus) return;

        // Check if the message was sent in a channel where links should not be blocked
        if (guildData.securitySystem.channels?.noSecure === message.channel.id) return;

        const regexBlockDomainShortlinks = /(https?:\/\/(?:www\.)?(?:surl\.li|u\.to|t\.co|gclnk\.com|qptr\.ru|uclck\.ru|go-link\.ru|envs\.sh|shorter\.me|sc\.link|goo\.su))/i;
        
        if (regexBlockDomainShortlinks.test(message.content)) {
            // Delete the phishing message
            await message.delete();
            // Kick the user who sent the malicious link
            try {
                const member = message.guild?.members.cache.get(message.author.id);
                if (member) {
                    await member.kick("Sent a malicious link");
                }
            } catch (error) {
                console.error("An error occurred while trying to kick the user:", error);
            }

            const logChannelId = guildData.securitySystem.channels!.logs;
            
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