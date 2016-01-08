var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catlg_MeasureTypeSchema = new Schema({
    idType: Number,
    abbrev: {type: String, required: true},
    description: {type: String, required: true}
});

module.exports = mongoose.model('catlg_MeasureType', catlg_MeasureTypeSchema);