import { Schema } from "mongoose";
import { t } from "../utils.js";

export const userSchema = new Schema(
    {
        id: t.string,
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    },
);