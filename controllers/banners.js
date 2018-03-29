var fs   = require('fs');
var Banners  = require('../models/Banners');
var mongoose   = require('mongoose');
var security = require('../locals/security');
module.exports = function(app){
    app.get('/getBanners', function(req, res, next) {
        var userId = req && req.session && req.session.user && req.session.user._id ? req.session.user._id : null;
        Banners.find({userId: userId},function (err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            res.json({ code:1, message: 'Banner rendered!', data:data });
        });

    });
    app.post('/addBanner', security.auth, function(req, res) {
        var banner = new Banners(req.body);
        banner.save(function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            res.json({ code:1, message: 'Banner created!',data:data });
        });
    });
    app.delete('/deleteBanner/(:id)', security.auth, function(req, res) {
        var id = req && req.params && req.params.id ? req.params.id : null;
        Banners.findById(id,function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            var path = './public/uploads/banners/'+data.image;
            try{
                fs.unlink(path);
            }
            catch (e){}
            Banners.remove({_id:mongoose.Types.ObjectId(id)},function(err,data) {
                if (err)
                    res.send(err);
                res.json({ code:1, message: 'Banner deleted!',data:[] });
            });
        });
    });
    app.post('/editBanner', security.auth, function(req, res) {
        var id = req.body._id;
        req.body.modified = new Date();
        var obj = req.body;
        try{
            delete obj._id;
        }
        catch(e){
        }
        Banners.findById(id,function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            var path = './public/uploads/banners/'+data.image;
            try{
                if (data.image != obj.image){
                    fs.unlink(path);
                }
            }
            catch (e){}
            Banners.findByIdAndUpdate(id,{$set:obj},function(err,data) {
                if (err){
                    res.send(err);
                }
                res.json({ code:1, message: 'Banner updated!',data:data });
            });
        });
    });
};
