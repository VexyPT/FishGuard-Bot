import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
	name: "ping",
	description: "Check Kiara's latency",
	descriptionLocalizations: {
		"pt-BR": "Cheque a latência da Kiara"
	},
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){

		const { client } = interaction;

		await interaction.reply({ content: `🏓 Pong! ${client.ws.ping}ms` });

	}
});