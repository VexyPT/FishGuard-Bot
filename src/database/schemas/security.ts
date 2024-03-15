import { Schema } from "mongoose";

export const securitySchema = new Schema(
    {
        count: { type: Number, default: 0 } // To save the number of phishing links deleted
    },
    {
        versionKey: false,
        statics: {
            async get(count: number) {
                return await this.findOne({ count }) ?? this.create({ count });
            }
        }
    },
);