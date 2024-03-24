const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    trialActive: { //default 3 days trial
        type: Boolean,
        default: true
    },
    trialPeriod: {
        type: Number,  //how many days
        default: 3
     },
    trialExpires : {
        type: Date
    },
    subscription: {
        type: String,
        enum: ["Trial", "Free", "Basic", "Premium"]
    },
    apiRequestCount: {
        type: Number,
        default: 0
    },
    monthlyRequestCount: { //this depends on the subscription type
        type: Number,
        default: 0
    },
    nextBillingDate: {
        type: Date,
    },
    payments: [{type: mongoose.Schema.ObjectId, ref: "Payment"}], //name of the model : Payment
    history: [{type: mongoose.Schema.ObjectId, ref: "History"}]
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports =  User 