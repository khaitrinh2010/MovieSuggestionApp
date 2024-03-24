const mongoose = require("mongoose")
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_KEY)
        console.log("Mongoose connects successfully")
    }
    catch(error){
        console.log("error while connecting")
    }
} 
connectDB()
module.exports = connectDB