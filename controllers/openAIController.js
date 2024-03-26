const asyncHandler = require("express-async-handler")
const axios = require("axios")
const OpenAi = require("openai")
const openai = new OpenAi(process.env.OPENAI_KEY)
const {History} = require("../models/ContentHistory")
const User = require("../models/User")

let conversationHistory = []
const aiController = async (req, res)=>{
    const userMessage = req.body.prompt
    conversationHistory.push({role: "user", content: userMessage})
    try{
        const response = await openai.chat.completions.create({messages: conversationHistory, model: "gpt-3.5-turbo", max_tokens: 40}) //limit the words being generated}) //generate the answer bassed on the context of the conversation
        const resp = response.choices[0].message.content
        const newContent = await History.create({
            user: req?.user?._id,
            content: resp
        })
        const userFound = await User.findById(req.user._id)
        //each time a user made a request: increase the apirequestCount by 1
        userFound.apiRequestCount += 1
        userFound.history.push(newContent?._id)
        await userFound.save() //remember to save after modification
        res.json({message: resp}) //send the response back
    }
    catch(error){
        res.json({message: error.message})
    }
    
}
module.exports = aiController