const express = require("express")
const { compileClientWithDependenciesTracked } = require('pug');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser')
const Post = require('../models/post')
require('dotenv').config();
const app = express()

app.set('view engine', 'pug')
app.set('views', './views')


app.get("/", async (req, res) => {
    username = req.cookies.username

    if(req.cookies.username){
        const gameInfo = await Post.find({userId: username}).sort({gameName: 1})
        const gameCount = await countGames()
        const gameMissing = await diffGames()
        res.render('index', {game: gameInfo, currentAmount: gameCount, diff: gameMissing})
    }else{
        res.render('landingPage')
    }
    
    
})

app.post('/', async (req,res) => {
    game={
        name: req.body.gametitle
    }
    const gameDetails = await getGame(game.name)
    const hasGames = await userContainsGame(gameDetails)
   
    const gameCount = await countGames()
    const gameMissing = await diffGames()
    
    res.render('Info', {games: gameDetails, currentAmount: gameCount, diff: gameMissing})
    usercoookieID = req.cookies.username
})


let token
async function getToken(){
    
    await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`,  {method: 'POST'})
    .then(response => response.json())
    .then(response => {
        token = response.access_token
        console.log(`Token generated: ${token}`)
    })

    
}

getToken()

async function getGame(game){
    return await fetch("https://api.igdb.com/v4/games", {method: 'POST', headers: {'Accept': 'application/json',
    'Content-Type': 'text/plain',
    'Client-ID': `${process.env.CLIENT_ID}`,
    'Authorization': `Bearer ${token}`}, body: `fields cover.*,*; search "${game}"; where platforms = [8];` })
    .then(response => response.json())
    .then(response => {
        if(response.length === 0){
            console.log("Not matches found")
        }
        return response.map(element => {
            games ={
                name:element.name,
                id: element.id,
                image: element.cover.url,
                summary: element.summary,
                dateRelease: element.release_dates,
                platform: element.platforms,
                hasGame: false
            }
            return games
                
        });

    })

    
}

app.post('/addGame', async (req,res) => {
    gameId = req.body.game
    return await fetch("https://api.igdb.com/v4/games", {method: 'POST', headers: {'Accept': 'application/json',
    'Content-Type': 'text/plain',
    'Client-ID': `${process.env.CLIENT_ID}`,
    'Authorization': `Bearer ${token}`}, body: `fields cover.*,*; where id = ${gameId};` })
    .then(response => response.json())
    .then(async response => {
        response.map(element => {
            games ={
                name:element.name,
                id: element.id,
                image: element.cover.url,
                summary: element.summary,
                dateRelease: element.release_dates,
                platform: element.platforms,
                
            }
            
        })
        const newPost = new Post({
            userId: usercoookieID,
            gameName: games.name,
            gameId:games.id,
            gameImage: games.image,
            gameSummary: games.summary,
            gamePLatform: games.platforms,
            hasGame: true
        })
        const savedGame = await newPost.save()
        res.status(200).json(savedGame) 
    })
    
})

app.delete('/removeGame', async (req,res) => {
    gameId = req.body.game
    Post.findOneAndDelete( {userId: req.cookies.username ,gameId: gameId}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ");
        }
    })
              
})

const totalGames = 10035
async function countGames(){
    
    await Post.countDocuments({userId: username}).then(results => {
        currentAmount = results
    })    
    return currentAmount
}
async function diffGames(){
    diff = (totalGames - currentAmount)
    return diff
}

async function userContainsGame(a){

    const gameInfo = await Post.find({userId: username}).sort({gameName: 1})
    const fromUser = []
    for (let i = 0; i < gameInfo.length; i++) {
        fromUser.push(gameInfo[i].name)
        for (let j = 0; j < a.length; j++) {
            if(a[j].name === gameInfo[i].gameName){
                a[j].hasGame = gameInfo[i].hasGame

            } 
        }
    }
}




module.exports = app

