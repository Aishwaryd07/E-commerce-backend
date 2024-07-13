/**
 * 
 */

const productModel = require("../models/product.model");

exports.addProduct = async (req,res) =>{
    //create product object 
    /* const categoryId = productModel.findOne({name : req.category},'id'); */
    const product = {
        name : req.body.name,
        description : req.body.description,
        category : req.body.category,
        price : req.body.price,
    }

    //add it into the db
    try{
        const prod_created = await productModel.create(product);

        //send creaated object back as response
        return res.status(201).send({
            message : "product created successfully."
        })
    }catch(err){
        console.log("error occured while adding the product" ,err)
        res.status(500).send({
            message : " some error occured."
        })
    }
}

exports.getAll = async (req, res)=>{
    /**
     * need to return all the products in the database 
     */
    try{
        const products = await productModel.find();
        if(!products){
            return res.status(200).send({
                message : "No products found."
            })
        }
        return res.status(200).send({
            message : "here is the complete list of products",
            products : products
        })
    }catch(err){
        console.log("Error occured while retrieving the list of products")
        res.status(500).send({
            message : "some internal error occured while retreving products "
        })
    }
}

exports.getById = async (req, res)=>{
    /**
     *find product using Id
     */
    const productId = req.params.id;
    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).send({
                message : "product not found."
            })
        }
        res.status(200).send({
            product : product 
        })
    }catch(err){
        console.log("some internal error while retreiving product")
        res.status(500).send({
            message : "some internal error while retreiving product"
        })
    }
}

exports.update = async (req,res) =>{
    //get id from params 
    const productId = req.params.id

    // search if given product is present or not 
    try{
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).send({
                message : "product with given Id doesn't exist."
            })
        }
        // update the product according to request 
        const update_data = {
            name : req.body.name,
            description : req.body.description,
            price : req.body.price,
            category : req.body.category
        }

        const updated_product = await productModel.findByIdAndUpdate(productId, update_data,{new : true});
        res.status(200).send({
            message : "product updated successfully.",
            product  : updated_product
        })

    }catch(err){
        console.log("some error occured while updating the product.",err)
        res.status(400).send({
            message : "sorry. some internal error while updating"
        })
    }
    
}

exports.delete = async (req, res) =>{
    //get id from params
    const productId = req.params.id
    //findif present 
    //delete 
    try{
        const product = await productModel.findByIdAndDelete(productId)
        if(!product){
            return res.status(404).send({
                message : "product not present."
            })
        }
        res.status(200).send({
            message : "deleted successfully."
        })
    }catch(err){
        console.log("error occured while deleting the product.",err);
        res.status(500).send({
            message : "sorry. some internal error while deleting."
        })
    }
}