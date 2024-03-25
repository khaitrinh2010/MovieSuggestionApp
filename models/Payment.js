const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    reference: {
        type: String,
        
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        required: true
    },
    subscriptionPlan: {
        type: String,
    },
    amount: {             //amount of money the user paid
        type: Number,
        default: 0
    },
    monthlyRequestCount: { //this depends on the subscription type
        type: Number,
        
    },
}, {
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema)
module.exports = Payment