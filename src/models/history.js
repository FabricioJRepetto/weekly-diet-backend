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
                protein: [String],
                foods: [],
                carbohydrate: [String],
                vegetal: [String],
                vegetalC: Boolean,
                date: String
            }
        ],
        customFoods: [
            {
                name: String,
                mix: Boolean,
                list: String,
                lists: [String],
                ingredients: [{}]
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