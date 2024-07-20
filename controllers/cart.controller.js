const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model")

exports.createNewCart = async (req, res) =>{
    //read req body
    //create cart object
    const cart_data = {
        user : req.user.userId,
        items : [],
        totalPrice : 0
    }

    //add this to db 
    try{
        const cartRes = await cartModel.create(cart_data)
        return res.status(201).send({
            message : "cart succefully created."
        })
    }catch(err){
        console.log("Error occurred while storing the cart",err)
        res.status(500).send({
            message : "error occurred while creating the cart"
        })
    }
}

exports.addItemToCart = async (req, res) =>{
    //check if cart is created or not 
    const userId = req.user.id
    const productId = req.body.product
    const quantity = req.body.quantity
    try{

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }


        let cart = await cartModel.findOne({user : userId})
        if(!cart){
            cart = await cartModel.create({
                user : userId,
                items : [],
                totalPrice : 0
            })
        }  

        const existingItemIndex = cart.items.findIndex(a => a.product.toString() === productId.toString());
        if (existingItemIndex!== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        }else{
            cart.items.push({product : product, quantity : quantity})
        }
        //console.log(`Before update: totalPrice = ${cart.totalPrice}, product.price = ${product.price}, quantity = ${quantity}`);
        cart.totalPrice += product.price * quantity;
        //console.log(`After update: totalPrice = ${cart.totalPrice}`);

        const updatedCart  = await cartModel.findByIdAndUpdate(cart.id,cart, {new : true})

        res.status(201).send({
            message : "item added succefully",
            updatedCart : updatedCart
        })

    }catch(err){
        console.log("Error occurred while adding item in the cart",err)
        res.status(500).send({
            message : "error occurred while adding item"
        })
    }
    //add items in the cart first check if the item is already present in the cart 
    //return res 

    
}

exports.getCart = async (req, res) =>{
    //get all cart from database
    try{
        const cart = await cartModel.findById(req.params.cartId);

        if(!cart){
            return res.status(404).send({
                message : "cart with given id is not present"
            })
        }

        res.status(200).send({
            message : "here is the cart",
            cart : cart
        })
    }catch(err){
        res.status(500).send({
            message : "some error occured while getting cart"
        })
    }   
}

exports.updateCartItem = async (req, res) =>{
    //get the cartid and itemid
    //create new object containing updated data 
    //insert in db
    //return res

    const cartId = req.params.cartId;
    const itemId = req.params.itemId;
    
    const updated_data = {
        quantity : req.body.quantity
    }

    try{
        const cart = await cartModel.findById(cartId);
        if(!cart){
            return res.status(404).send({
                message : "cart with given id is not present"
            })
        }
        const item = cart.items.find(item => item._id.toString() === itemId);
        if(!item){
            return res.status(404).send({
                message : "item with given id is not present in cart"
            })
        }
        const productId = item.product;
        const product = await productModel.findById(productId);
        if (!product) {
        return res.status(404).send({
            message: "product with given id is not present"
        });
        }
        const oldQuantity = item.quantity;
        if(updated_data.quantity){
            item.quantity = updated_data.quantity;
        }
        
        const priceDiff = (item.quantity - oldQuantity) * product.price;
        
        cart.totalPrice += priceDiff;
        
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cart, {new: true});
        
        res.status(201).send({
            message : "Item updated in cart successfully",
            cart : updatedCart
        })
    }catch(err){
        res.status(500).send({
            message : "some error occured while updating item in cart"
        })
    }
}

exports.deleteCartItem = async (req,res) =>{
    //search requested cart and item
    //delete it 
    
    const cartId = req.params.cartId;
    const itemId = req.params.itemId;

    try{
        const cart = await cartModel.findById(cartId);
        if(!cart){
            return res.status(404).send({
                message : "cart with given id is not present"
            })
        }
        const item = cart.items.find(item => item._id.toString() === itemId);
        if(!item){
            return res.status(404).send({
                message : "item with given id is not present in cart"
            })
        }
        cart.items.pull(item);
        const productId = item.product;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: "product with given id is not present"
            });
        }
        cart.totalPrice -= product.price * item.quantity;
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cart, {new: true});
        res.status(200).send({
            message : "Item deleted from cart successfully"
        })
    }catch(err){
        res.status(500).send({
            message : "some error occured while deleting item from cart"
        })
    }
}