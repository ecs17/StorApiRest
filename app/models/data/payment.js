var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);
var ObjectId = mongoose.Schema.Types.ObjectId;

var PaymentsSchema = new Schema({
    date: {type: Date, required: true},
    amountCredit: {type: Number, required: true},
    amountPayment: {type: Number, required: true},
    amountPayWith: {type: Number, required: true},
    idUser: {type: ObjectId, required: true},
    idCredit: {type: Number, required: true},
    nowIdCredit: Number,
    coments: String
});

PaymentsSchema.plugin(autoIncrement.plugin, {model: 'Payment', field: 'idPayment' });
module.exports = mongoose.model('Payment', PaymentsSchema);