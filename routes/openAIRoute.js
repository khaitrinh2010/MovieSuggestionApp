//new comment here
const express = require("express")
const aiRoute = express.Router()
const aiControlller = require("../controllers/openAIController")
const isAuthenticated = require("../middlewares/authenticated")

aiRoute.post("/generate", isAuthenticated, aiControlller)

module.exports = aiRoute
