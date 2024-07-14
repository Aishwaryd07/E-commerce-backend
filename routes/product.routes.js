
/**
 * create api : POST localhost:8000/ecomm/api/v1/product
 */
const authMW = require("../Middleware/auth.mw");
const productController = require("../controllers/product.controller")
const reqValidator = require("../Middleware/requestValidator");
const requestValidator = require("../Middleware/requestValidator");
const { request } = require("express");

module.exports = (app) =>{
    app.post("/ecomm/api/v1/product",[authMW.verifyToken,authMW.isAdmin,requestValidator.validateProductRequest(['name','description','price','category'])],productController.addProduct)
    app.get("/ecomm/api/v1/product",authMW.verifyToken,productController.getAll)
    app.get("/ecomm/api/v1/product/:id",authMW.verifyToken, productController.getById)
    app.put("/ecomm/api/v1/product/:id",[authMW.verifyToken, authMW.isAdmin],productController.update)
    app.delete("/ecomm/api/v1/product/:id",[authMW.verifyToken, authMW.isAdmin],productController.delete)
    app.get("/ecomm/api/v1/cateories/:categoryId/products",authMW.verifyToken,productController.getProductsUnderCategory)
}