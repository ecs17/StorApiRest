var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catlg_UserTypeSchema = new Schema({
    abbrev: {type: String, required: true},
    description: {type: String, required: true},
    idType: Number
});
module.exports = mongoose.model('catlg_UserType', catlg_UserTypeSchema);