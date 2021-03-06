"use strict"

const { Schema } = require("mongoose")

const threadSchema = new Schema(
    {
        title: {
            type: String,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
)

module.exports = threadSchema