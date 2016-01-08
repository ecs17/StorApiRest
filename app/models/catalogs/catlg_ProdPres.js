var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catlg_ProdPresSchema = new Schema({
    idType: Number,
    abbrev: {type: String, required: true},
    description: {type: String, required: true}
});

module.exports = mongoose.model('catlg_ProdPres', catlg_ProdPresSchema);