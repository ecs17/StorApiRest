var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var DevchangprodsSchema = new Schema({
    dateTransact: {type: Date, required: true},
    idUser: {type: String, required: true},
    idProvider: Number,
    bar_code: String,
    stoksNow: {type: Number, required: true},
    stoksNew: {type: Number, required: true},
    typeTransact: {type: Number, required: true},
    refund: Number,
    change: Number,
    obs: String
});

DevchangprodsSchema.plugin(autoIncrement.plugin, {model: 'Devchangprod', field: 'idTransact' });
module.exports = mongoose.model('Devchangprod', DevchangprodsSchema);