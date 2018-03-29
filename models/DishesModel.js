var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var DishesSchema  = new Schema({
    name: String,
    prediction: Number,
    status: {type:'String',default:'1'},
    modified: {type:Date, default: new Date()},
    created: {type:Date, default: new Date()}
});
module.exports = mongoose.model('DishesModel', DishesSchema);