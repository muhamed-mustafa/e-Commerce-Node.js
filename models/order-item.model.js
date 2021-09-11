const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({

    quantity : 
    {
        type     : Number,
        required : true
    },

    product : 
    {
        type     : mongoose.Schema.Types.ObjectId,
        ref      : "Product",
        required : true
    }

}, {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const OrderItem  = mongoose.model("OrderItem", orderItemSchema);

orderItemSchema.virtual('id' , () =>
{
    return this._id.toHexString();
});

orderItemSchema.set('toJSON' , {
    virtuals : true
});

module.exports = OrderItem;