const async   = require('async');
const mongoose   = require('mongoose');
const DishesModel  = require('../models/DishesModel');
module.exports = function(app){
    app.get('/api/v1/dishes', function(req, res) {
        DishesModel.find({}, function (err,data) {
            if (err) {
                res.json({ code:200, status:0, message: 'DishesModel rendered!', data:[] });
            }
            else  {
                res.json({ code:200, status:1, message: 'products rendered!', data:data });
            }
        });
    });

    app.post('/api/v1/dishes', function(req, res) {
        req.body.modified = new Date();
        req.body.created = new Date();
        var dish = new DishesModel(req.body);
        dish.save(function(err,data) {
            if (err)
                return res.send({ code:0, message: 'Error created!',data:[]});
            res.json({ code:1, message: 'Product created!',data:data });
        });
    });
    app.delete('/api/v1/dishes/:id', function(req, res) {
        DishesModel.findById(req.params.id,function(err,data) {
            DishesModel.remove({_id:mongoose.Types.ObjectId(req.params.id)},function(err,data) {
                if (err)
                    return res.json({ code:0, message: 'Product could not deleted!',data:[] });
                res.json({ code:1, message: 'Product deleted!',data:[] });
            });
        });
    });
    app.put('/api/v1/dishes', function(req, res) {

        var id = req.body._id;
        req.body.modified = new Date();
        var obj = req.body;
        try{
            delete obj._id;
        }
        catch(e){
        }

        DishesModel.findById(id,function(err,data) {
            DishesModel.findByIdAndUpdate(id,{$set:obj},function(err,updated) {
                if (err){
                    return res.json({ code:0, message: 'Product could not updated!',data:updated });
                }
                res.json({ code:1, message: 'Product updated!',data:updated });
            });
        });
    });
};
