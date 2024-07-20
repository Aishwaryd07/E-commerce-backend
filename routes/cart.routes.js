const cartController = require("../controllers/cart.controller")
const authMW = require("../Middleware/auth.mw")


module.exports = (app) =>{
    app.post('/ecomm/api/v1/cart', authMW.verifyToken,cartController.createNewCart);
    app.post('/ecomm/api/v1/cart/items', authMW.verifyToken,cartController.addItemToCart);
    app.get('/ecomm/api/v1/cart/:cartId', authMW.verifyToken, cartController.getCart);
    app.patch('/ecomm/api/v1/cart/:cartId/items/:itemId',authMW.verifyToken, cartController.updateCartItem);
    app.delete('/ecomm/api/v1/cart/:cartId/items/:itemId',authMW.verifyToken,cartController.deleteCartItem);
}