//content history between the user and the chatbot
const mongoose = require("mongoose")

const historySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const History = mongoose.model("History", historySchema)
module.exports = {History}