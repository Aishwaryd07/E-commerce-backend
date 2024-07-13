/**
 * Logic for user signup 
 */

const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const secret = require("../config/auth.cofig")

//1 read the request body

//2 send it to model 

//3 return respnose 

exports.signup = async (req,res) =>{
    const requestBody = req.body
    const userObj = {
        name : requestBody.name,
        email : requestBody.email,
        password : bcrypt.hashSync(requestBody.password,8),
        userType : requestBody.userType,
        userId : requestBody.userId
    }

    try{
        const user_created = await userModel.create(userObj)
        
        //following object is to just ensure that we don't return password in the response

        const res_obj = {
            name : user_created.name,
            email : user_created.email,
            userType : user_created.userType,
            userId : user_created.userId,
            createdAt : user_created.createdAt,
            updatedAt: user_created.updatedAt
        }
        res.status(201).send(res_obj)
    }catch(err){
        console.log("error occurred while creating the user",err)
        res.status(500).send("error while registering user")
    }
}

exports.signin = async (req,res) =>{

    //check if the user is present or not 
    const user = await userModel.findOne({userId : req.body.userId})

    if(user == null){
        return res.status(400).send("User is not present.. You need to sign up first")
    }


    //check if the password is correct

    const isvalidPassword = bcrypt.compareSync(req.body.password, user.password)
    if(!isvalidPassword){
        return res.status(401).send("Incorrect password entered")
    }


    //generate jwt access token and send it as response
    const token = jwt.sign({id : user.userId},secret.secret,{
        expiresIn : 1000
    })
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        accesstoken : token

    })
    
}