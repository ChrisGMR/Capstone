require('dotenv').config();
const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const userhomepage = require("./routes/homepage")
const welcome = require("./routes/auth")
// const postRoute = require("./routes/post")
const fetch = require('node-fetch');
const { compileClientWithDependenciesTracked } = require('pug');
const app = express()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () =>{
    console.log("connected to MongoDB")
})



app.set('view engine', 'pug')
app.set('views', './views')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static('methods'))
app.use(express.static('images'))

app.use("/", welcome )
app.use("/homepage", userhomepage)
// app.use("/post", postRoute)


app.listen(3000)

