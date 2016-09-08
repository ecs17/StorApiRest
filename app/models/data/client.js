var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var ClientSchema = new Schema({
    dateReg: {type: Date, required: true},
    name: {type: String, required: true},
    ap1: String,
    ap2: String,
    street : String,
    col : String,
    num : String,
    phone: String,
    rfc: String,
    limitCredit: {type: Number, require: true},
    ent: String,
    mun: String,
    loc: String,
    cp: String,
    clientType : {
        idType: Number,
        abbrev: {type: String, required: true},
        description: {type: String, required: true}
    },
    coments: String
});

ClientSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'idClient', startAt: 1});
module.exports = mongoose.model('Client', ClientSchema);