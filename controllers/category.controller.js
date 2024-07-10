const categoryModel = require("../models/category.model")

exports.createNewCategory = async (req, res) =>{
    //read req body
    //create category object
    const cat_data = {
        name : req.body.name,
        description : req.body.description
    }

    //add object into mongodb collection
    try{
        const categoryRes = await categoryModel.create(cat_data)
        return res.status(201).send({
            message : "Category succefully created.",
            category : categoryRes
        })
    }catch(err){
        console.log("Error occurred while storing the category",err)
        res.status(500).send({
            message : "error occurred while creating the category"
        })
    }
    //send response 
}

exports.getCategories = async (req, res) =>{
    //get all categories from dadabase
    try{
        const categories = await categoryModel.find({},'name');

        if(!categories){
            return res.status(200).send({
                message : "no category is present"
            })
        }

        res.status(200).send({
            message : "here are the available categories",
            categories : categories
        })
    }catch(err){
        res.status(500).send({
            message : "some error occured while getting list of categories"
        })
    }   
}

exports.updateCategory = async (req, res) =>{
    //get the categoryid
    //create new object containing updated data 
    //insert in db
    //return res

    const categoryId = req.params.id;
    
    const updated_data = {
        name : req.body.name,
        description : req.body.description
    }

    try{
        const updatedCat = await categoryModel.findByIdAndUpdate(categoryId, updated_data,{new : true});
        if(!updatedCat){
            return res.status(404).send({
                message : "category with given id is not present"
            })
        }
        res.status(201).send({
            message : "Category updated successfully",
            category : updatedCat
        })
    }catch(err){
        res.status(500).send({
            message : "some error occured while creating the category"
        })
    }
}

exports.deleteCategory = async (req,res) =>{
    //search requested category
    //delete it 
    
    const category = req.params.name;

    try{
        const deletedCat = await categoryModel.findOneAndDelete({name : category})
        if(!deletedCat){
            return res.status(404).send({
                message : "category not found"
            })
        }
        res.status(200).send({
            message : "deleted successfully"
        })
    }catch(err){
        res.status(500).send({
            message : "some internal server  error while deleting the category"
        })
    }
    
    
}
