function errorHandler (err , req , res , next)
{
    if(err.name === 'UnauthorizedError') 
    {
        return res.status(401).send({status : 401 , message : "Unauthorized User." , success : false});
    }

    if(err.name === 'ValidationError') 
    {
        return res.status(401).send({status : 401 , message : err.message , success : false});
    }

    return res.status(500).send({status : 500 , message : err.message , success : false});
}

module.exports = errorHandler;