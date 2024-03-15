import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
	name: "ping",
	description: "「Bot」 Check the bot latency.",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){

		const { client } = interaction;

		await interaction.reply({ content: `${client.ws.ping}ms` });

	}
});