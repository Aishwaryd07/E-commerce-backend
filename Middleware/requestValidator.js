//check if the input request has all the mandatory fields 

//for prodcut requests 
const validateProductRequest = (fields) =>{

    return (req,res,next) =>{
        /*
        if(!req.body.name){
            return res.status(400).send({
                message : "name not provided."
            })
        }
        if(!req.body.price){
            return res.status(400).send({
                message : "price not provided."
            })
        }
        if(!req.body.category){
            return res.status(400).send({
                message : "category not provided."
            })
        }
        if(!req.body.category){
            return res.status(400).send({
                message : "price not provided."
            })
        }
        if(!req.body.description){
            return res.status(400).send({
                message : "descritpion not provided."
            })
        }
            */
        for(let field of fields){
            if(!req.body[field]){
                return res.status(400).send({
                    message : `${field} is required`
                })
            }
        }
        next();
    }
}

module.exports = {
    validateProductRequest : validateProductRequest
}