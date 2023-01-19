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
                mealType: String,
                protein: [String],
                foods: [],
                carbohydrate: [String],
                vegetal: [String],
                vegetalC: Boolean,
                date: String
            }
        ],
        days: [
            {
                lunch: {
                    foods: [String],
                    protein: [String],
                    carbohydrate: [String],
                    vegetal: [String],
                    fruit: [String],
                    vegetalC: Boolean,
                    cheatfood: [String],
                    empty: {
                        type: Boolean,
                        default: true
                    }
                },
                dinner: {
                    foods: [String],
                    protein: [String],
                    carbohydrate: [String],
                    vegetal: [String],
                    fruit: [String],
                    vegetalC: Boolean,
                    cheatfood: [String],
                    empty: {
                        type: Boolean,
                        default: true
                    }
                },
                breakfast: {
                    foods: [String],
                    breakfast: [String],
                    fruit: [String],
                    cheatfood: [String],
                    empty: {
                        type: Boolean,
                        default: true
                    }
                },
                afternoonsnack: {
                    foods: [String],
                    breakfast: [String],
                    fruit: [String],
                    cheatfood: [String],
                    empty: {
                        type: Boolean,
                        default: true
                    }
                },
                cheatFood: [String],
                workOut: [String],
                empty: {
                    type: Boolean,
                    default: false
                },
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
                cheatfood: Boolean,
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