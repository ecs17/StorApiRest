var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catlg_ProviderStatusSchema = new Schema({
    abbrev: {type: String, required: true},
    description: {type: String, required: true},
    idType: Number
});
module.exports = mongoose.model('catlg_ProviderSt', catlg_ProviderStatusSchema);