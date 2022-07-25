const express = require("express")
const {token} = require('./homepage')
const app = express()
const Post = require('../models/post')
const { PostController } = require("moongose/controller")





// Add Game from user selection 

// app.post('/addGame', async (req,res) => {
    
//     gameId = req.body.game
//     return await fetch("https://api.igdb.com/v4/games", {method: 'POST', headers: {'Accept': 'application/json',
//     'Content-Type': 'text/plain',
//     'Client-ID': `${process.env.CLIENT_ID}`,
//     'Authorization': `Bearer ${token}`}, body: `fields cover.*,*; where id = ${gameId};` })
//     .then(response => response.json())
//     .then(response => {
//         // how to take the bject and send it to the Scheman so we can send it to the api.
//         //figure out how to do this on mongoose. 
//         console.log(token)
        
        
//     })
    
// })

// module.exports = app


// response.map(element => {
//     specificGame ={
//         name:element.name,
//         id: element.id,
//         image: element.cover.url,
//         summary: element.summary,
//         dateRelease: element.release_dates,
//         platform: element.platforms,
        
//     }
//     console.log(specificGame)
// }); 



// userID = req.cookies.nToken
        // const newPost = new Post({
        //     userId: userID,
        //     game:{
        //         data:response
        //     } 
        // })
        

        // const savedGame = await newPost.save()
        // res.status(200).json(savedGame)