const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../config/auth.cofig")

const verifySignupbody = async (req,res,next) =>{
    
     
    try{
        //check for name
        if(!req.body.name){
            return res.status(500).send("Failed !, name is not provide in the request object")
        }

        // check for email

        if(!req.body.email){
            return res.status(500).send("Failed !, email is not provide in the request object")
        }

        //check for userId
        
        const userID = await userModel.findOne({user : req.body.userId})
        if(userID){
            return res.status(500).send("Failed ! user with same userId is already present")
        }

        next()
        
    }catch(err){
        console.log("error while validating request object")
        res.status(500).send("error occured while validating",err)
    }
    
}

const verifySignInbody = (req,res,next) =>{
    //check for userId
    if(!req.body.userId){
        return res.status(400).send("user Id is not provided")
    }

    //check for password 
    if(!req.body.password){
        return res.status(400).send("passowrd not entered")
    }
    next()
}

const verifyToken = (req,res, next) => {
    //check if token is present 
    const token = req.headers['x-access-token']
    if(!token){
        return res.status(403).send("UnAutorized ! Token not found")
    }

    //validate token
    jwt.verify(token, auth_config.secret, async (err, decoded)=>{
        if(err){
            return res.status(401).send("UnAuthorized !")
        }

        const user = await userModel.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "UnAuthorized ! the user with given token doesn't exist"
            })
        }
        //set the user info in the req body. 
        // this is to help next middleware as well as other controllers 
        req.user = user

        next()
    } )
    
}

const isAdmin = (req, res, next) =>{
    const user = req.user  //it is set in the above method line 70
    if(user && user.userType == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message : "Only Admin users are allowed to access this endpoint."
        })
    }
}
module.exports = {
    verifySignupbody : verifySignupbody,
    verifySignInbody : verifySignInbody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}