/**
 * intercept the request POST 127.0.0.1:8000/ecomm/api/v1/auth/signup
 */

const authController = require("../controllers/auth.controller")
const authMW = require("../Middleware/auth.mw")


module.exports = (app) =>{
    app.post("/ecomm/api/v1/auth/signup",[authMW.verifySignupbody],authController.signup)

    /**
     * route for 
     * POST localhost:8000/ecomm/api/v1/auth/signin
     */
    app.post("/ecomm/api/v1/auth/signin",[authMW.verifySignInbody],authController.signin)
}
