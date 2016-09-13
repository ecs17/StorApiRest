var mongoose = require('mongoose');
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://localhost:27017/casant_db');
autoIncrement.initialize(connection);

var ProviderSchema = new Schema({
    idCode: String,
    dateRegister: {type: Date, required: true},
    name: {type: String, required: true},
    rfc: String,
    phone: String,
    address: String,
    code: {type: String, required: true, index: {unique: true}},
    obs: String,
    providerType : {
        idType: Number,
        abbrev: {type: String, required: true},
        description: {type: String, required: true}
    },
    statusType : {
        idType: Number,
        abbrev: {type: String, required: true},
        description: {type: String, required: true}
    }
});

ProviderSchema.plugin(autoIncrement.plugin, {model: 'Provider', field: 'idProvider', startAt: 1});
module.exports = mongoose.model('Provider', ProviderSchema);