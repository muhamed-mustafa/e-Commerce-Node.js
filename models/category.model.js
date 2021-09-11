const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({

    name : 
    {
        type     : String,
        required : true,
        trim     : true
    },

    icon : 
    {
        type : String,
        trim     : true
    },

    color : 
    {
        type : String,
        trim     : true
    },
}, {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Category  = mongoose.model("Category", categorySchema);

categorySchema.virtual('id' , () =>
{
    return this._id.toHexString();
});

categorySchema.set('toJSON' , {
    virtuals : true
});


module.exports = Category;