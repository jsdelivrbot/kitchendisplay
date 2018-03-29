const async   = require('async');
const mongoose   = require('mongoose');
const OrdersModel  = require('../models/OrdersModel');
const DishesModel  = require('../models/DishesModel');
const Json2csvParser = require('json2csv').Parser;

module.exports = function(app){
    app.get('/api/v1/orders', function(req, res) {

                async.parallel([
            function(cbk){
                OrdersModel.find({status:1}).populate('dishId', '_id name prediction').exec(cbk);
            },
            function(cbk){
                DishesModel.find({status:1},cbk);
            }
            ],function (err, docs){
                if(err){
                    res.send(err);
                }
                else {
                    res.json({ code:1, message: 'orders rendered!', orders:docs[0], dishes:docs[1] });
                }
        });
    });

    app.get('/api/v1/download', function(req, res) {

        async.parallel([
            function(cbk){
                OrdersModel.find({status:1}).populate('dishId', '_id name prediction').exec(cbk);
            },
            function(cbk){
                DishesModel.find({status:1},cbk);
            }
        ],function (err, docs){
            if(err){
                res.send(err);
            }
            else {
                var records = [];
                var orders = docs && docs[0] && docs[0].length ? docs[0] : [];
                var totalDishes = docs && docs[1] && docs[1].length ? docs[1].length : [];
                orders.forEach(function (value) {
                    records.push({
                        "Dish Name": value.dishId.name,
                        "Created-till-now": totalDishes * value.quantity,
                        "Prediction": value.dishId.prediction
                    });
                });

                const json2csvParser = new Json2csvParser({  });
                const csv = json2csvParser.parse(records);
                res.attachment('filename.csv');
                res.status(200).send(csv);
                //res.json({ code:1, message: 'orders rendered!', orders:docs[0], dishes:docs[1] });
            }
        });
    });

    app.get('/api/v1/kitchenDisplay', function(req, res) {
        var startOfToday = new Date();
        start.setHours(0,0,0,0);
        var _id = Math.floor(startOfToday.getTime() / 1000).toString(16) + "0000000000000000";
        async.parallel([
            function(cbk){
                OrdersModel.find({status:1,  _id: { $gt: _id }}).populate('dishId', '_id name prediction').exec(cbk);
            },
            function(cbk){
                DishesModel.find({},cbk);
            }
        ],function (err, docs){
            if(err){
                res.send(err);
            }
            else {
                res.json({ code:1, message: 'orders rendered!', orders:docs[0], dishes:docs[1] });
            }
        });

    });
    app.post('/api/v1/orders', function(req, res) {
        req.body.modified = new Date();
        req.body.created = new Date();
        var dish = new OrdersModel(req.body);
        dish.save(function(err,data) {
            if (err)
                return res.send({ code:0, message: 'Error created!',data:[]});
            res.json({ code:1, message: 'Product created!',data:data });
        });
    });
    app.delete('/api/v1/orders/:id', function(req, res) {
        OrdersModel.findById(req.params.id,function(err,data) {
            OrdersModel.remove({_id:mongoose.Types.ObjectId(req.params.id)},function(err,data) {
                if (err)
                    return res.json({ code:0, message: 'Product could not deleted!',data:[] });
                res.json({ code:1, message: 'Product deleted!',data:[] });
            });
        });
    });
    app.put('/api/v1/orders', function(req, res) {

        var id = req.body._id;
        req.body.modified = new Date();
        var obj = req.body;
        try{
            delete obj._id;
        }
        catch(e){
        }

        OrdersModel.findById(id,function(err,data) {
            OrdersModel.findByIdAndUpdate(id,{$set:obj},function(err,updated) {
                if (err){
                    return res.json({ code:0, message: 'orders could not updated!',data:updated });
                }
                res.json({ code:1, message: 'orders updated!',data:updated });
            });
        });
    });
};
