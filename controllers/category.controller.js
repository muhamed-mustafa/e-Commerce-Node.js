const express  = require("express"),
      Category = require('../models/category.model'),
      _        = require('lodash'),
      mongoose = require('mongoose');

exports.getCategories = async (req, res) => 
{
      try
      {
          const {page = 0 , limit =0} = req.query;
          const categories = await Category.find().limit(limit * 1).skip((page - 1) * limit).exec();
    
          if (!categories)
          {
            res.status(500).send({status : 500 , message : "No Categories Found." , success : false});
          }
        
          res.status(200).send({ status: 200 , categories , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};

exports.getCategory = async (req, res) => 
{
      try
      {
          const category = await Category.findById(req.params.id);
    
          if (!category)
          {
            res.status(500).send({status : 500 , message : "No Category Found with the given id." , success : false});
          }
        
          res.status(200).send({ status: 200 , category , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};

exports.addNewCategory = async (req , res) =>
{
    try
    {
        const newCategory = await new Category({ ...req.body });
        newCategory.save();
        res.status(200).send({ status: 200 , newCategory , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.updateCategory = async (req , res) =>
{
    try
    {
        const cat      = await Category.findById(req.params.id);
        const category = await _.extend(cat , req.body);
        
        category.updateAt = Date.now();
        await category.save();

        res.status(200).send({ status: 200 , category , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.deleteCategory = async (req , res) =>
{
    try
    {
        if(!mongoose.isValidObjectId(req.params.id))
        {
            throw { status: 400, message: "Invalid Category Id!", success: false };
        }

        const category = await Category.findByIdAndRemove(req.params.id);
        if(!category)
        {
            res.status(404).send({status : 404 , message : "Category is not found!" , success : false});   
        }

        res.status(200).send({ status: 200 , message : "Category is deleted successfully." , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};