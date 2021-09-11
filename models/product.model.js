const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    
    name : 
    {
        type     : String,
        required : true,
        trim     : true
    },
    
    description :
    {
        type     : String,
        required : true,
        trim     : true
    },

    slug :
    {
        type : String,
    },

    richDescription :
    {
        type    : String,
        default : "",
        trim     : true
    },

    thumbnail : 
    {
        type     : String,
        required : true 
    },

    images :
    [
        {
            type : String
        }
    ],

    brand : 
    {
        type     : String,
        trim     : true
    },

    price : 
    {
        type     : Number,
        default  : 0,
        required : true 
    },

    category :
    {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Category"
    },

    countInStock :
    {
      type     : Number,
      required : true,
      min      : 0,
      max      : 255
    },

    rating :
    {
        type     : Number,
        default  : 0,   
    },

    isFeatured : 
    {
        type    : Boolean,
        default : false
    },

}, {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Product  = mongoose.model("Product", productSchema);

productSchema.virtual('id' , () =>
{
    return this._id.toHexString();
});

productSchema.set('toJSON' , {
    virtuals : true
});

module.exports = Product;