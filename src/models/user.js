// const bcrypt = require("bcryptjs");
import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        user_id: String,
        picture: String,
        name: String,
        password: String,
        config: {
            tutorials: {
                activated: {
                    type: Boolean,
                    default: true
                },
                mainMenu: {
                    type: Boolean,
                    default: true
                },
                creationMenu: {
                    type: Boolean,
                    default: true
                },
                history: {
                    type: Boolean,
                    default: true
                },
                checkpoints: {
                    type: Boolean,
                    default: true
                },
                customMeals: {
                    type: Boolean,
                    default: true
                },
            },
            height: {
                type: Number,
                default: 0
            },
            plateStyle: {
                type: Boolean,
                default: true
            },
        }
    },
    {
        versionKey: false,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

export default model("User", UserSchema);