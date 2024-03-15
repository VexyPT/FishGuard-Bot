import { Schema } from "mongoose";
import { t } from "../utils.js";

export const guildSchema = new Schema(
    {
        id: t.string,
        securitySystem: {
            systemStatus: { type: Boolean, default: false },
            channels: {
                logs: { type: String, default: null },
                noSecure: { type: String, default: null }
            }
        }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);