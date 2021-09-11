const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    orderItems :
    [
        {
            type     : mongoose.Schema.Types.ObjectId,
            ref      : "OrderItem",
            required : true
        }
    ],

    shippingAddress1 :
    {
        type     : String ,
        required : true
    },

    shippingAddress2 :
    {
        type     : String ,
    },

    city :
    {
        type     : String ,
        required : true
    },

    zip :
    {
        type     : String ,
        required : true
    },

    country :
    {
        type     : String ,
        required : true
    },

    phone :
    {
        type     : String ,
        required : true
    },

    status :
    {
        type     : String ,
        required : true,
        default  : "pending"
    },

    totalPrice :
    {
        type     : Number
    },

    user : 
    {
        type     : mongoose.Schema.Types.ObjectId,
        ref      : "User"
    }

}, {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const Order = mongoose.model("Order", orderSchema);

orderSchema.virtual('id' , () =>
{
    return this._id.toHexString();
});

orderSchema.set('toJSON' , {
    virtuals : true
});

module.exports = Order;