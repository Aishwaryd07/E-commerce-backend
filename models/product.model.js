/**
 * lets write down properties of products 
 * name , price, category, brand_name, id/sr no., 
 */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    id : {
        type : Number,
        autoIncrement : true
    }
},{timestamps : true, versionKey : false})

module.exports = mongoose.model('Product',productSchema);