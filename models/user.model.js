const mongoose = require("mongoose"),
      bcrypt   = require('bcrypt'),
      jwt      = require('jsonwebtoken');

const userSchema = mongoose.Schema({

    username :
    {
        type     : String,
        required : true,
        trim     : true
    },

    name : 
    {
        type     : String,
        required : true,
        trim     : true
    },
    
    email : 
    {
        type     : String,
        required : true,
        trim     : true,
    },

    password : 
    {
        type     : String,
        required : true
    },

    phone : 
    {
        type     : String,
        required : true,
        trim     : true
    },

    isAdmin :
    {
        type    : Boolean,
        default : false
    },

    token :
    {
        type : String,
        trim : true
    },

    street : 
    {
        type     : String,
        default  : "",
        trim     : true
    },

    apartment : 
    {
        type     : String,
        default  : "",
        trim     : true
    },

    city : 
    {
        type     : String,
        default  : "",
        trim     : true
    },

    zip : 
    {
        type     : String,
        default  : "",
        trim     : true
    },

    country : 
    {
        type     : String,
        default  : "",
        trim     : true
    },

}, {versionKey : false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const User  = mongoose.model("User", userSchema);

userSchema.methods.generateAuthToken = async function () 
{
    const user = this;
    return jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET, 
    {
        expiresIn: 2592000 // expires in 1 month
    });
}


userSchema.pre("save" , async function(next)
{
    const user = this;
    if(user.isModified("password"))
    {
        user.password = await bcrypt.hashSync(user.password , 10);
    }

    next();
});

userSchema.virtual('id' , () =>
{
    return this._id.toHexString();
});

userSchema.set('toJSON' , {
    virtuals : true
});

module.exports = User;