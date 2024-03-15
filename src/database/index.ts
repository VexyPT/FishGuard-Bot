import mongoose, { InferSchemaType, model } from "mongoose";
import { guildSchema } from "./schemas/guild.js";
import { userSchema } from "./schemas/user.js";
import { securitySchema } from "./schemas/security.js";
import { log } from "#settings";
import chalk from "chalk";

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    log.success(chalk.green("MongoDB connected"));
  })
  .catch((err) => {
    log.error(err);
    process.exit(1);
  });

export const db = {
  guilds: model("guild", guildSchema, "guilds"),
  users: model("user", userSchema, "users"),
  security: model("security", securitySchema, "security"),
};

export type GuildSchema = InferSchemaType<typeof guildSchema>;
export type UserSchema = InferSchemaType<typeof userSchema>;
export type SecuritySchema = InferSchemaType<typeof securitySchema>;
