import { Schema } from "mongoose";
import { t } from "../utils.js";

export const userSchema = new Schema(
    {
        id: t.string,
        wallet: {
            coins: { type: Number, default: 0 },
        },
        badges: { type: Array, default: [] }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    },
);