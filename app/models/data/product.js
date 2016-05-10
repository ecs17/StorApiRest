var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    bar_code: {type: String, required: true, index: {unique: true}},
    cv_product: {type: String, required: true, unique: true},
    name_prod: {type: String, required: true},
    desc_prod: {type: String, required: true},
    stocks: {type: Number, required: true},
    dates: {
        expiration: Date,
        last_update: {type: Date, required: true},
        existed: {type: Date}
    },
    price: {
        purchase_price: {type: Number, required: true},
        sale_price: {type: Number, required: true}
    },
    presentation_type: {
        idType: Number,
        abbrev: {type: String, required: true},
        description: {type: String, required: true}
    },
    measure_type: {
        idType: Number,
        abbrev: {type: String, required: true},
        description: {type: String, requires: true}
    },
    taxes: {
        iva: {type: Number, required: false},
        ieps: {type: Number, requied: false}
    }
});

module.exports = mongoose.model('Product', ProductSchema);