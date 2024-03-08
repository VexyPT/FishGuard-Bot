import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
	name: "ping",
	description: "[BOT] Exibe a latência do bot",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){

		const { client } = interaction;

		await interaction.reply({ content: `🏓 Pong! ${client.ws.ping}ms` });

	}
});