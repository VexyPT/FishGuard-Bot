const dotenv = require("dotenv");
const fs = require("fs");
const { ShardingManager } = require('discord.js');

let tokenFile = ".env";
if (fs.existsSync('.env.development')) {
  tokenFile = '.env.development';
}

// Loads the environment variables from the corresponding .env file
const result = dotenv.config({
  path: tokenFile
});

// Checks if there was an error loading the environment variables
if (result.error) {
  console.error("Error loading environment variables:", result.error);
  process.exit(1);
}

const manager = new ShardingManager("../../index.js", {
	token: process.env.clientToken,
	totalShards: 'auto',
	respawn: true,
});

manager.spawn({
	timeout: 60000,
});

manager.on('shardCreate', async (shard) => {
    console.log("SHARD: Sucess --- Shard " + shard.id + " launched");
});