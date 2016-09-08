var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var CreditsSchema = new Schema({
    dateStart: {type: Date, required: true},
    dateLastSale: {type: Date, required: true},
    dateEnd: Date,
    amountCredit: {type: Number, required: true},
    idClient: {type: Number, required: true},
    statusCredit: {type: Boolean, required: true},
    detailCredit: [
        {
            idSale: {type: Number, required: true},
            payment: Number
        }
    ]
});

CreditsSchema.plugin(autoIncrement.plugin, {model: 'Credit', field: 'idCredit' });
module.exports = mongoose.model('Credit', CreditsSchema);