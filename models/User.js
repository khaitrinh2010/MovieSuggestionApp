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
    subscriptionPlan: {
        type: String,
        enum: ["Trial", "Free", "Basic", "Premium"],
        default: "Trial"
    },
    apiRequestCount: {
        type: Number,
        default: 0
    },
    monthlyRequestCount: { //this depends on the subscription type
        type: Number,
        default: 100 //default when 3 days trial is implemented
    },
    nextBillingDate: {
        type: Date,
        default: new Date()
    },
    payments: [{type: mongoose.Schema.ObjectId, ref: "Payment"}], //name of the model : Payment
    history: [{type: mongoose.Schema.ObjectId, ref: "History"}]
}, {
    timestamps: true,
    toJSON : {virtuals: true},  
    toObject : {virtuals: true} //these 2 lines help us see this properties upon querying
})

//virtual properrties: useful for fields that can be derived from other fields in the database

const User = mongoose.model("User", userSchema)
module.exports =  User 