var async   = require('async');
var Categories  = require('../models/Categories');
var security = require('../locals/security');
module.exports = function(app){
	app.get('/getCategories', function(req, res, next) {
        var userId = req && req.session && req.session.user && req.session.user._id ? req.session.user._id : null;
		async.parallel([
			function(cbk){
                Categories.find({userId:userId},function (err,data) {
	            if (err) {
	            	cbk(null, null);
	            }
	            else{
	            	cbk(null, data);
	            }
        		});
			},
			function(cbk){
                Categories.find({parent:null, userId:userId},{name:1,parent:1},function (err,data) {
		           if (err) {
		            	cbk(null, null);
		            }
		            else{
		            	cbk(null, data);
		            }
	            });
			}
			],function (err, docs){
            if (err || !docs) {
                return res.sendStatus(402);
            }
				else {
					res.json({ code:1, message: 'Category rendered!', data:docs[0], parents:[{_id:null,name:'/'}].concat(docs[1]) });
				}
		})
	});
	app.post('/addCategory', security.auth, function(req, res) {
		req.body.parent = req.body.parent._id;
		var category = new Categories(req.body);
        category.save(function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            res.json({ code:1, message: 'Categry created!',data:data });
        });
	});
	app.post('/deleteCategory', security.auth, function(req, res) {
        Categories.remove({_id:mongoose.Types.ObjectId(req.body._id)},function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            res.json({ code:1, message: 'Categry deleted!',data:[] });
        });
	});
	app.post('/editCategory', security.auth, function(req, res) {
		var id = req.body._id;
		req.body.modified = new Date();
		req.body.parent = req.body.parent._id;
		var obj = req.body;
		try{
			delete obj._id;
		}
		catch(e){
		}
        Categories.findByIdAndUpdate(id,{$set:obj},function(err,data) {
            if (err || !data) {
                return res.sendStatus(402);
            }
            res.json({ code:1, message: 'Categry updated!',data:data });
        });
	});
};
