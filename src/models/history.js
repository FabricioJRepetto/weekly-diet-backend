import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const HistorySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        meals: [
            {
                protein: [],
                foods: [],
                carbohydrate: [],
                vegetal: [],
                vegetalC: Boolean,
                date: String
            }
        ]
    },
    {
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

export default model("History", HistorySchema);