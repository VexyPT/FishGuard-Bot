import { Schema } from "mongoose";

export const keySchema = new Schema(
    {
        key: { type: String, unique: true, required: true },
        isActivated: { type: Boolean, default: false }
    },
    {
        statics: {
            async get(key: string) {
                return await this.findOne({ key }) ?? this.create({ key });
            }
        }
    }
);