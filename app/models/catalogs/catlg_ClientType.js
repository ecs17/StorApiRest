var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catlg_ClientTypeSchema = new Schema({
    abbrev: {type: String, required: true},
    description: {type: String, required: true},
    idType: Number
});
module.exports = mongoose.model('catlg_ClientType', catlg_ClientTypeSchema);