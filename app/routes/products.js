var Product = require('../models/data/product');

module.exports = function(app, express){
    var apiRouter = express.Router();
    
    apiRouter.route('/product')
        .post(function(req, res){
            var product = new Product();
            product.bar_code = req.body.bar_code;
            product.cv_product = req.body.cv_product;
            product.name_prod = req.body.name_prod;
            product.desc_prod = req.body.desc_prod;
            product.stocks = req.body.stocks;
            product.dates = {
                expiration: req.body.expDate,
                last_update: new Date(),
                existed: new Date()
            };
            product.price = req.body.price;
            product.presentation_type = req.body.presentation_type;
            product.measure_type = req.body.measure_type;
            product.taxes = req.body.taxes;
            
            product.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'Ya existe un producto con el codigo de barras'});

                    else
                        return res.send(err)
                }
                res.json({message: 'Producto creado'});
            });
        })
        .get(function(req, res){
            Product.find(function(err, products){
                if(err) res.send(err);
                
                res.json(products);
            });
        });
    
    return apiRouter;
}