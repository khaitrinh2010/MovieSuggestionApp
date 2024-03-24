const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
dotenv.config()
require("./utils/connectDB")
const PORT = process.env.PORT || 5000
const {userRoute} = require("./routes/userRoutes")
const aiRoute = require("./routes/openAIRoute")

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use("/api/v1/users", userRoute)
app.use("/api/v1/openai", aiRoute)
app.listen(PORT, ()=>{
    console.log("Server is running")
})