var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var OrdersModel   = new Schema({
    quantity: {type:'Number',default:0},
    dishId: {type:mongoose.Schema.Types.ObjectId, ref: 'DishesModel'},
    status: {type:'String',default:'1'},
    modified: {type:Date, default: new Date()},
    created: {type:Date, default: new Date()}
});
module.exports = mongoose.model('OrdersModel', OrdersModel);