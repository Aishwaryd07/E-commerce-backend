const categoryController = require("../controllers/category.controller")
const authMW = require("../Middleware/auth.mw")

/**
 * Intercept the request 
 * POST localhost:8000/ecomm/api/v1/categories
 * 
 * PUT localhost:8000/ecomm/api/v1/categories
 */

module.exports = (app) => {
    app.post("/ecomm/api/v1/categories", [authMW.verifyToken, authMW.isAdmin], categoryController.createNewCategory);
    app.get("/ecomm/api/v1/categories", authMW.verifyToken, categoryController.getCategories);
    app.put("/ecomm/api/v1/categories/:id",[authMW.verifyToken, authMW.isAdmin], categoryController.updateCategory);
    app.delete("/ecomm/api/v1/categories/name/:name",[authMW.verifyToken, authMW.isAdmin], categoryController.deleteCategory)
}

/**
 * check if the user is signed in or not 
 * and then give control to the respecitve controller 
 */

