"use strict"

const { Schema } = require("mongoose")

const messageSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        delete: {
            type: Number,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
)

module.exports = messageSchema