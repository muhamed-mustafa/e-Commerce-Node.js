const multer   = require('multer');

const storage  = multer.diskStorage
({
    destination : function (req , file , cb)
    {
        cb(null , 'upload');
    },

    filename : function (req , file , cb)
    {
        cb(null , `${file.originalname}`);
    }
});

const upload = multer({storage : storage});

validationPhoto = async (req , res , next) =>
{
    try
    {
        if(req.files.image)
        {
            req.files.image.map(file =>
            {
                if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
                {
                    throw {status: 400, message: `${file.originalname} should be a valid image`, success: false};
                }

                if(files.size > 1000000)
                {
                    throw {status: 400, message: `${file.originalname} is larger`, success: false};
                }
            })
        }

        if (req.files.thumbnail)
        {
            req.files.thumbnail.map(file =>
            {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
                {
                    throw {status: 400, message: `${file.originalname} should be a valid image`, success: false};
                }

                if (file.size > 1000000)
                {
                    throw {status: 400, message: `${file.originalname} is larger`, success: false};
                }
            })
        }

        next();
    } 
    
    catch(e)
    {   
        res.status(500).send({status : 500 , message : e.message , success : false});
    }
}


module.exports = {upload , validationPhoto};
