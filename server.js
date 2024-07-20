const user_model = require("./models/user.model");
const express = require("express");
const server_config = require("./config/server.config")
const db_config = require("./config/db.config")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express()
app.use(express.json())


mongoose.connect(db_config.DB_URL)

const db = mongoose.connection

db.on("error",(err)=>{
    console.log("some error occured..",err)
})

db.once("open",()=>{
    console.log("connected to the db")
    init()
})

async function init(){
    try{
        let user = await user_model.findOne({userId : "admin"})
        if(user){
            console.log("admin is already present")
            return
        }
    }catch(err){
        console.log("error while finding admin data");
    }

    
    try{
        user = await user_model.create({
            name : "Aishwary Dandale",
            userId : "admin",
            password : bcrypt.hashSync("admin@123",8),
            email : "admin123@gmail.com",
            userType : "ADMIN"
        })
        console.log("admin created",user)
    }catch(err){
        console.log("error occured while creating admin",err)
        
    }
    
}
/**
 * stich routes to server so that server knows about the route.
 */
require("./routes/auth.route")(app)
require("./routes/category.routes")(app)
require("./routes/product.routes")(app)
require("./routes/cart.routes")(app)


app.listen(server_config.Port, ()=>{
    console.log("server started at port number",server_config.Port);
})
