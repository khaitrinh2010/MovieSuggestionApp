const stripe = require("stripe")(process.env.SECRET_KEY)
const nextBillingDate = require("../utils/nextBillingDate")
const renewBill = require("../utils/renewBill")
const Payment = require("../models/Payment")
const User = require("../models/User")
const { userProfile } = require("./User")

//make the payment
const handle = async(req, res)=>{
    const {amount, subscriptionPlan} = req.body
    const user = req?.user

    //User make a payment
    try{
        //tao 1 stripe object de pay
        const  payment = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "usd",
            metadata: {
                userID: user?._id.toString(),
                userEmail: user?.email,
                subscriptionPlan
            }
        })
        res.json({
            clientSecret: payment.client_secret,
            paymentID: payment.id,
            metadata: payment.metadata
        })
    }
    catch(error){
        res.json({message: error.message})
    }
}
const handleFree = async(req, res)=>{
    const user = req?.user
    const billingDate = nextBillingDate()
    try{
        //if the user expires the current subscription, it becomes free subscription
        if(renewBill(user)){
            user.subscriptionPlan = "Free"
            user.monthlyRequestCount = 5
            user.apiRequestCount = 0
            user.nextBillingDate = billingDate
            await user.save()
            const newPayment = await Payment.create({
                user: user?._id,
                subscriptionPlan: "Free",
                amount: 0,
                status: "Success",
                monthlyRequestCount: 5,
                currency: "usd"
            })
            await newPayment.save()
            user.payments.push(newPayment._id)
            return res.json({
                status: "success",
                message: "renew success",
                user
            })
        }
        else{
            return res.json({
                message: "Subscription not due yet"
            })
        }
    }
    catch(error){
        return res.json({message: error.message})
    }
}

//server verifies the payment and update the user information in the database
const verifyPayment = async (req, res) => {
    const { paymentID } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentID);
        if (paymentIntent.status!= "succeeded") { // Assuming you want to check for success
            const { metadata } = paymentIntent;
            const { userID, subscriptionPlan } = metadata;
            const userFound = await User.findById(userID);
            if (!userFound) {
                return res.json({ message: "No user found" });
            }
            const amount = paymentIntent.amount / 100; // because the unit is in cents
            const currency = paymentIntent.currency;

            //initialize an payment object
            const newPayment = await Payment.create({
                user: userID,
                reference: paymentID,
                currency,
                subscriptionPlan,
                status: "Success",
                amount,
            });

            // Common update object
            //each time make a payment then the billing date increases by 1 month
            const updateData = {
                subscriptionPlan,
                trialPeriod: 0, // out of trialPeriod
                nextBillingDate: nextBillingDate(), // Assuming this function is defined elsewhere
                apiRequestCount: 0, // reset the API request count
                monthlyRequestCount: subscriptionPlan === "Basic" ? 50 : 100, // Conditional value based on plan
                $addToSet: { payments: newPayment._id },
            };

            const updatedUser = await User.findByIdAndUpdate(userID, updateData, { new: true });
            return res.json({
                status: "Success",
                user: updatedUser,
            });
        } else {
            return res.json({ message: "Payment not successful" });
        }
    } catch (error) {
        res.json({ status: "Fail", message: error.message });
    }
};

module.exports = {handle, handleFree, verifyPayment}