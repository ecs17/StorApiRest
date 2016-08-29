var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var SalesSchema = new Schema({
    dateSale: {type: Date, required: true},
    totalAmount: {type: Number, required: true},
    idClient: Number,
    idUser: {type: Number, required: true},
    totalProducts: {type: Number, required: true},
    comments: String,
    typeSale: Number,
    detailSale: [
        {
            bar_code: {type: String, required: true},
            quantity: {type: Number, required: true}
        }
    ]
});

SalesSchema.plugin(autoIncrement.plugin, {model: 'Sale', field: 'idSale' });
module.exports = mongoose.model('Sale', SalesSchema);