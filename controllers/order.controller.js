const express   = require("express"),
      Order     = require('../models/orders.model'),
      OrderItem = require('../models/order-item.model');

exports.getOrders = async (req, res) => 
{
      try
      {
          const {page , limit} = req.query;
          const orders = await Order.find().populate("user" , "name").sort({created_at : -1}).limit(limit * 1).skip((page - 1) * limit).exec();
    
          if (!orders)
          {
            res.status(500).send({status : 500 , message : "No Orders Found." , success : false});
          }
        
          res.status(200).send({ status: 200 , orders , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};

exports.getOneOrder = async (req, res) => 
{
      try
      {
          const order = await Order.findById(req.params.id)
          .populate("user" , "name")
          .populate({path : "orderItems" ,
           populate : 
           {
              path : "product" , populate : "category"
           }});
         
          if (!order)
          {
            res.status(500).send({status : 500 , message : "this order is given by this id not found!" , success : false});
          }
        
          res.status(200).send({ status: 200 , order , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};

exports.addNewOrder = async (req , res) =>
{
    try
    {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>
        {
            let newOrderItem = await new OrderItem({
                    quantity : orderItem.quantity ,
                    product  : orderItem.product
            });

            await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsIdsResloved = await orderItemsIds;

        const totalPrices    = await Promise.all(orderItemsIdsResloved.map(async (orderItemId) =>
        {
            const orderItem  = await OrderItem.findById(orderItemId).populate("product" ,"price");
            const totalPrice = await orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }));

        const totalPrice = totalPrices.reduce((a , b) => a + b , 0);

       const newOrder = await new Order({ ...req.body , orderItems : orderItemsIdsResloved , totalPrice : totalPrice});
       await newOrder.save();

       res.status(200).send({status : 200 , newOrder , success : true});

    }

    catch (err)
    {
      res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.updateOrder = async (req , res) =>
{
    try
    {
        const order =  await Order.findByIdAndUpdate(req.params.id , 
        {
                status : req.body.status
        } , {new : true});

       res.status(200).send({status : 200 , order , success : true});

    }

    catch (err)
    {
      res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.deleteOrder = async (req , res) =>
{
    try
    {
       Order.findByIdAndRemove(req.params.id).then(async order =>
        {
            if(!order)
            {
                res.status(404).send({status : 404 , message : "Order is not Found." , success : false});   
            }
          
            
            await order.orderItems.map(async orderItem =>
            {
                    await OrderItem.findByIdAndRemove(orderItem);
            })        
            
        });

        res.status(200).send({ status: 200 , message : "Order is deleted successfully." , success: true });
    }

    catch (err)
    {
      res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.getTotalSales = async (req , res) =>
{
    try
    {
        const totalSales = await Order.aggregate([
            {$group : {_id : null , totalSales : {$sum : "$totalPrice"}}}
        ]);

        if(!totalSales)
        {
            res.status(400).send({status : 404 , message : "The order sales cannot be generated." , success : false})
        }

        res.status(200).send({ status: 200 , totalSales : totalSales.pop().totalSales , success: true });
    }

    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.ordersCount = async (req , res) =>
{
    try
    {
        const orderCount = await Order.countDocuments({});

        if(!orderCount)
        {
            res.status(404).send({status : 404 , orderCount : orderCount ,success : false});   
        }

        res.status(200).send({ status: 200 , orderCount : orderCount , success: true });
    } 
    
    catch (err)
    {
        res.status(500).send({status : 500 , error : err.message , success : false});   
    }
};

exports.getOrderUser = async (req, res) => 
{
      try
      {
          const userOrderList = await Order.find({user : req.params.userId})
          .populate("user" , "name")
          .populate({path : "orderItems" ,
           populate : 
           {
              path : "product" , populate : "category"
           }});
         
          if (!userOrderList)
          {
            res.status(500).send({status : 500 , message : "this order is given by this id not found!" , success : false});
          }
        
          res.status(200).send({ status: 200 , userOrderList , success: true });
      }

      catch (err)
      {
        res.status(500).send({status : 500 , error : err.message , success : false});   
      }
   
};