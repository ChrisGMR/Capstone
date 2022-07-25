const express = require("express")
const { compileClientWithDependenciesTracked } = require('pug')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const bcrypt = require("bcrypt")
const app = express()


app.set('view engine', 'pug')
app.set('views', './views')
app.use(cookieParser())


app.get("/", (req,res)=> {
    res.render('landingPage')
})
app.get("/Signup", (req,res)=> {
    res.render("Signup")
})
app.get("/Login", (req,res)=> {
    res.render("Login")
})
//Signup
app.post("/Signup", async (req,res)=>{
    
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password: hashedPassword
        })
        
        //save user return res
        
        const user = await newUser.save()
        // const token = jwt.sign({ _id: newUser._id }, process.env.SECRET, { expiresIn: '60 days' });
        // res.cookie('nToken', token, { maxAge: 900000, httpOnly: true })
        user[req.body.username] = req.body.password
        res.cookie("username", req.body.username).redirect("/homepage")        

        
        
    }catch(err){
        res.status(500).json(err)
    }
    
})
//Login
app.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({email: req.body.email });
        !user && res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        // const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
        // res.cookie('nToken', token, { maxAge: 900000, httpOnly: true })
        
        res.cookie("username", user.username).redirect("/homepage")
        
    
    }catch(err){
        res.status(500).json(err)
    }
   
})
//LogOut

app.get("/logout", (req,res)=>{
    if(req.body.userId == req.params.id){
        res.clearCookie("username", req.body.username)
        res.render('landingPage')
        
    }
    
})

module.exports = app