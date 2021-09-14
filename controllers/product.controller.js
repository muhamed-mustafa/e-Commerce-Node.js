const express    = require("express"),
      Product    = require('../models/product.model'),
      Category   = require('../models/category.model'),
      slugify    = require("slugify"),
      _          = require('lodash'),
      authJwt    = require('../middlewares/jwt');
      mongoose   = require('mongoose'),
      Cloudinary = require('cloudinary').v2,
      fs         = require('fs');
      
exports.getAllProducts = async (req , res) =>
{
    try
      {
        let filter = {};
        if(req.query.categories)
        {
            filter = {category : req.query.categories.split(',')};
        }

          const {page = 0 , limit =0} = req.query;
          const products = await Product.find(filter).populate('category').limit(limit * 1).skip((page - 1) * limit).exec();
    
          if (!products)
          {
            res.status(500).send({status : 500 , message : "No Product Found." , success : false});
          }
        
          res.status(200).send({ status: 200 , products , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
};

exports.getProductById = async (req , res) =>
{
    try
    {
        const products = await Product.findById(req.params.id).select("name image _id");
  
        if (!products)
        {
          res.status(500).send({status : 500 , message : "this product is given by this id not found!" , success : false});
        }
      
        res.status(200).send({ status: 200 , products , success: true });
    }

    catch (err)
    {
      res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.addNewProduct = async (req , res) =>
{

    try
    {
        const product  = await new Product({ ...req.body });
        const images   = [];

        product.slug   = await slugify(req.body.name , {
              replacement: '-',
              remove: undefined,
              lower: true,
              strict: false,
              locale: 'vi'
        });
    

        if(typeof req.files === "object")
        {
            if(req.files.thumbnail)
            {
                const path       = req.files.thumbnail[0].path;
                const thumbnail  = await Cloudinary.uploader.upload(path , 
                    {
                        public_id: `Products/commerce-${product.slug}-${req.files.thumbnail[0].originalname.toLowerCase().replace(/\\s/g, '-')}`,
						use_filename: true,
						tags: `product, ${req.files.thumbnail[0].originalname}, ${new Date().toISOString()}`,
						width: 500,
						height: 500,
						crop: "scale",
						placeholder: true
                    });
          
            product.thumbnail = thumbnail.secure_url;

            if (thumbnail)
            {
                fs.unlinkSync(path);
            }

          }

          if(req.files.image && req.files.image.length > 0)
          {
              for(let image = 0; image < req.files.image.length; image++)
              {
                  const path = req.files.image[image].path;

                  const cloudinary = await Cloudinary.uploader.upload(path , 
                  {
                        public_id : `Products/commerce-${product.slug}-${req.files.image[image].originalname.toLowerCase().replace(/\\s/g, '-')}`,
                        use_filename : true,
                        tags : `product, ${req.files.thumbnail[0].originalname}, ${new Date().toISOString()}`,
						width: 500,
						height: 500,
						crop: "scale",
						placeholder: true
                  })

                  product.images = [...product.images , cloudinary.secure_url ];

                  if(cloudinary)
                  {
                      fs.unlinkSync(path);
                  }
              }
          }

        }

        const category   = await Category.findOne({name: req.query.category});
        product.category = category._id;

        product.save();
        res.status(200).send({ status: 200 , product , success: true }); 
    }
    
    catch (err)
    {
        console.log(err)
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }   
};


exports.updateProduct = async (req , res) =>
{
    try
    {
        const product = await Product.findById(req.params.id);
        if(!product)
        {
          throw { status: 402, message: "Product is not found!", success: false };
        }

        if(typeof req.files === "object")
        {
            if(req.files.thumbnail)
            {
                const path = req.files.thumbnail[0].path;
                const thumbnail  = await Cloudinary.uploader.upload(path , 
                    {
                        public_id: `Products/commerce-${product.slug}-${req.files.thumbnail[0].originalname.toLowerCase().replace(/\\s/g, '-')}`,
						use_filename: true,
						tags: `product, ${req.files.thumbnail[0].originalname}, ${new Date().toISOString()}`,
						width: 500,
						height: 500,
						crop: "scale",
						placeholder: true
                    });
          
            product.thumbnail = thumbnail.secure_url;

            if (thumbnail)
            {
                fs.unlinkSync(path);
            }

          }

          if(req.files.image && req.files.image.length > 0)
          {
              for(let image = 0; image < req.files.image.length; image++)
              {
                  const path = req.files.image[image].path;

                  const cloudinary = await Cloudinary.uploader.upload(path , 
                  {
                        public_id : `Products/commerce-${product.slug}-${req.files.image[image].originalname.toLowerCase().replace(/\\s/g, '-')}`,
                        use_filename : true,
                        tags : `product, ${req.files.thumbnail[0].originalname}, ${new Date().toISOString()}`,
						width: 500,
						height: 500,
						crop: "scale",
						placeholder: true
                  })

                  product.images = [...product.images , cloudinary.secure_url ];

                  if(cloudinary)
                  {
                      fs.unlinkSync(path);
                  }
              }
          }

        }

        product = await Product.findOneAndUpdate(product._id , {$set : {...req.body }} , {new : true})
        res.status(200).send({ status: 200 , product , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.deleteProduct = async (req , res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            throw { status: 400, message: "Invalid Product Id!", success: false };
        }

        const product = await Product.findByIdAndRemove(req.params.id);
        if(!product)
        {
            res.status(404).send({status : 404 , message : "Product is not found!" , success : false});   
        }

        res.status(200).send({ status: 200 , message : "Product is deleted successfully." , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};


exports.getProductsCount = async (req , res) =>
{
    try
    {
        const productCount = await Product.countDocuments({});

        if(!productCount)
        {
            res.status(404).send({status : 404 , productCount : productCount ,success : false});   
        }

        res.status(200).send({ status: 200 , productCount : productCount , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.getFeaturedProductCount = async (req , res) =>
{
    try
    {
        const count   = req.params.count ? req.params.count : 0 ;
        const product = await Product.find({isFeatured : true}).limit(+count);

        if(!product)
        {
            res.status(404).send({status : 404 , productCount : productCount ,success : false});   
        }

        res.status(200).send({ status: 200 , product , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

