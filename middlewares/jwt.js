const expressJwt = require('express-jwt'),
      User       = require('../models/user.model'),
      jwt        = require('jsonwebtoken');

function authJwt()
{
    return expressJwt
    ({
        secret : process.env.JWT_SECRET ,
        algorithms : ['HS256'] ,
        isRevoked  : isRevoked
    }).unless({
        path :
        [
            { url : /\/api\/v1\/products(.*)/ ,   methods : ["GET" , 'OPTIONS'] } ,
            { url : /\/api\/v1\/categories(.*)/ , methods : ["GET" , 'OPTIONS'] } ,
            { url : /\/api\/v1\/users(.*)/ ,      methods : ["GET" , 'OPTIONS'] } ,

            `${process.env.API_URL}/users/register`,
            `${process.env.API_URL}/users/login`,
            
        ]
    })
}

verifyToken = async (req , res , next) =>
{
    try
    {
        const token   = req.header("Authorization");
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user    = User.findOne({_id : decoded._id});
        req.user      = user;
        next();
    }   
    
    catch (err)
    {
        res.status(401).send({ status: 401, message: "Unauthorized", success: false });
    }
}

async function isRevoked (req , payload , done)
{
    if(!payload.isAdmin)
    {
        done(null , true)
    }

    done();
}

module.exports = authJwt; 