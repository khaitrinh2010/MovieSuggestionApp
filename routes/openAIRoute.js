//new comment here
const express = require("express")
const aiRoute = express.Router()
const aiControlller = require("../controllers/openAIController")
const isAuthenticated = require("../middlewares/authenticated")
const checkApiLimit = require("../middlewares/checkApiLimit")

aiRoute.post("/generate", isAuthenticated, checkApiLimit, aiControlller)

module.exports = aiRoute
