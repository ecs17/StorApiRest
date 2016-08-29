var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var ClientsSchema = new Schema({
    dateReg: {type: Date, required: true},
    name: {type: String, required: true},
    ap1: String,
    ap2: String,
    street : String,
    col : String,
    num : Number,
    phone: String,
    rfc: String,
    age: Number,
    ent: Number,
    mun: Number,
    loc: String,
});

ClientsSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'idClient', startAt: 1});
module.exports = mongoose.model('Client', ClientsSchema);