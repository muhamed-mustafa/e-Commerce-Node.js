const express  = require("express"),
      User     = require('../models/user.model'),
      bcrypt   = require('bcrypt'),
      jwt      = require('jsonwebtoken'),
      authJwt  = require('../middlewares/jwt'),
      _        = require('lodash');

      
exports.getUsers = async (req, res) => 
{
      try
      {
          const {page , limit} = req.query;
          const users = await User.find().select('name email phone').limit(limit * 1).skip((page - 1) * limit).exec();
    
          if (!users)
          {
            res.status(500).send({status : 500 , message : "No Users Found." , success : false});
          }
        
          res.status(200).send({ status: 200 , users , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
};

exports.userProfile = async (req, res) => 
{
      try
      {
          const user = await User.findById(req.params.userId);
    
          if (!user)
          {
            res.status(500).send({status : 500 , message : "No User Found with the given id." , success : false});
          }
        
          res.status(200).send({ status: 200 , user , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};

exports.signup = async (req , res) =>
{
    try
    {
        const newUser = await new User({ ...req.body , password : bcrypt.hashSync(req.body.password , 10) });
        // const token   = jwt.sign({ _id : newUser._id.toString()}, process.env.JWT_SECRET, 
        // {
        //     expiresIn: 2592000 // expires in 1 month
        // });

        // newUser.token = token; 
        await newUser.save();
        res.status(200).send({ status: 200 , newUser , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.login = async (req , res) =>
{
    try
    {
        if (!req.body.username || !req.body.password)
        {
            throw { status: 422, message: "Invalid username or password", success: false };
        }

        let user, token, decoded;
               

        const emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (emailValidation.test(req.body.username))
        {
            user = await User.findOne({ email: req.body.username })
        }

        else
        {
            user = await User.findOne({ username: req.body.username });
        }

        // generate Token 
        let generateToken = jwt.sign({ _id : user._id.toString() , isAdmin : user.isAdmin}, process.env.JWT_SECRET, 
        {
            expiresIn: 2592000 // expires in 1 month
        });    

        if (user)
        {
            const passwordValidation = await bcrypt.compareSync(req.body.password, user.password);
            if (!passwordValidation)
            {
                res.status(422).send({ status: 422, message: "Invalid password", success: false });
            } 
            
            else
            {
                if (user.token)
                {
                    let currentTime = new Date().getTime() / 1000;
                    decoded         = jwt.verify(user.token, process.env.JWT_SECRET);

                    if (currentTime > decoded.exp)
                    {
                        // Token is expired
                        token = generateToken;
                        user.token = token;
                        await user.save();
                        res.status(200).send({ status: 200, user: user, success: true });

                    }
                    
                    else
                    {
                        res.status(200).send({ status: 200, user: user, success: true });
                    }

                }
                
                else
                {
                    // User have token but not exipred
                    token = generateToken;
                    user.token = token;
                    await user.save();
                    res.status(200).send({ status: 200, user: user, success: true });
                }
            }
        }

        else
        { 
            throw { status: 404, message: "User does not exists", success: false }
        }
    }
    
    catch (err) 
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.deleteUser = async (req , res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            throw { status: 400, message: "Invalid User Id!", success: false };
        }

        const user = await User.findByIdAndRemove(req.params.id);
        if(!user)
        {
            res.status(404).send({status : 404 , message : "User is not found!" , success : false});   
        }

        res.status(200).send({ status: 200 , message : "User is deleted successfully." , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.getUserCount =  async (req , res) =>
{
    try
    {
        const userCount = await User.countDocuments({});

        if(!userCount)
        {
            res.status(404).send({status : 404 , userCount : userCount ,success : false});   
        }

        res.status(200).send({ status: 200 , userCount : userCount , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};