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
                mmealType: String,
                protein: [String],
                foods: [],
                carbohydrate: [String],
                vegetal: [String],
                vegetalC: Boolean,
                date: String
            }
        ],
        checkpoints: [
            {
                date: String,
                weight: String,
                muscle: String,
                fat: String,
                abdominal: Number,
                body_age: Number
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