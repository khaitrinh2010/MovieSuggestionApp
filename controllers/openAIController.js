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
        const resp = response.choices[0].message.content.trim()
        const newContent = await History.create({
            user: req?.user?._id,
            content: resp
        })
        const userFound = await User.findById(req.user._id)
        //each time a user made a request: increase the apirequestCount by 1
        userFound.apiRequestCount += 1
        userFound.history.push(newContent?._id)
        await userFound.save() //remember to save after modification
        //resp is the movie title
        const finalResp = await fetchMovieDetails(resp)
        res.json({status: "Success", message: finalResp?finalResp:" Nothing"})
    }
    catch(error){
        res.json({message: error.message})
    }
    
}
function isDigit(character) {
    return /^\d$/.test(character);
  }
async function fetchMovieDetails(movieTitle, req, res) {
    let movieTitleList = []
    let ans = ""
    for(i = 0; i < movieTitle.length; i ++){
        if(movieTitle[i] == "." || movieTitle[i] == "\n"){
            continue
        }
        else if(isDigit(movieTitle[i])){
            if(ans.length > 0){
                movieTitleList.push(ans.slice(0, -1).trim())
                ans = ""
                continue
            }
        }
        else{
            ans += movieTitle[i]
        }

    }
    let informationList  = []
    for(i = 0; i < movieTitleList.length;  i++){
        try {
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
            api_key: process.env.MOVIE_API,
            query: movieTitleList[i],
            },
        });
    
        const results = tmdbResponse.data.results;
        if (results.length > 0) {
            const firstResult = results[0];
            const releaseDate = firstResult.release_date
            const popular = firstResult.popularity
            const voteAverage = firstResult.vote_average
            const posterPath = firstResult.poster_path;
            const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
            const description = firstResult.overview
            informationList.push({releaseDate, popular, voteAverage, posterUrl, description})
            // Here you can return the poster URL or do something with it
        } else {
            console.log("Fail")
        }
        } catch (error) {
        console.error('Error fetching movie details:', error);
        }
    
    }
    return informationList
  }
module.exports = aiController