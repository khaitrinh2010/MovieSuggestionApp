const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const cron = require("node-cron")
dotenv.config()
require("./utils/connectDB")
const PORT = process.env.PORT || 8000
const {userRoute} = require("./routes/userRoutes")
const aiRoute = require("./routes/openAIRoute")
const {stripeRoute} = require("./routes/stripeRoute")
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true }))


//this task runs everyday, for trial period
cron.schedule("0 0 * * * *", async(req, res)=>{
    try{
        const today = new Date()
        User.updateMany({
            trialActive: true,
            trialExpires: {$lt: today}  //trialExpires is the day the service becomes expired
        },{
            trialActive: false,
            subscriptionPlan: "Free",
            monthlyRequestCount: 5
        })
    }
    catch(error){

    }
})

//for the free plan
cron.schedule("0 0 1 * * *", async(req, res)=>{
    try{
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Free",
            nextBillingDate: {$lt: today}  //trialExpires is the day the service becomes expired
        },{
            monthlyRequestCount: 0
        })
    }
    catch(error){

    }
})

cron.schedule("0 0 1 * * *", async(req, res)=>{
    try{
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Basic",
            nextBillingDate: {$lt: today}  //trialExpires is the day the service becomes expired
        },{
            monthlyRequestCount: 0
        })
    }
    catch(error){

    }
})

cron.schedule("0 0 1 * * *", async(req, res)=>{
    try{
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Premium",
            nextBillingDate: {$lt: today}  //trialExpires is the day the service becomes expired
        },{
            monthlyRequestCount: 0
        })
    }
    catch(error){

    }
})
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}
//which means that only web pages served from this origin 
//are permitted to make requests to the server

app.use(cors(corsOptions))
app.use("/api/v1/users", userRoute)
app.use("/api/v1/openai", aiRoute)
app.use("/api/v1/stripe", stripeRoute)
app.listen(PORT, ()=>{
    console.log("Server is running")
})