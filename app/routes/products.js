var Product = require('../models/data/product');

module.exports = function(app, express, _){
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
    
    apiRouter.route('/product/:product_id')
        .get(function(req, res){
            Product.findById(req.params.product_id, function(err, product){
                if(err) res.send(err);
                
                res.json(product);
            })
        })
        .put(function(req, res){
            Product.findById(req.params.product_id, function(err, product){
                if(err) res.send(err);
                var cadDate;
                
                if(req.body.expDate !== undefined)
                    cadDate = req.body.expDate;
                else
                    cadDate = req.body.dates.expiration;
                
                product.bar_code = req.body.bar_code;
                product.cv_product = req.body.cv_product;
                product.name_prod = req.body.name_prod;
                product.desc_prod = req.body.desc_prod;
                product.stocks = req.body.stocks;
                product.presentation_type = req.body.presentation_type;
                product.measure_type = req.body.measure_type;
                product.taxes = req.body.taxes;
                
                var d = new Date(),
                month = '' + (d.getMonth()),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                var currentDate = new Date(year, month, day);
                
                product.price = {
                    purchase_price: req.body.price.purchase_price,
                    sale_price: req.body.price.sale_price
                };
                product.dates = {
                    expiration: cadDate,
                    last_update: currentDate,
                    existed: req.body.dates.existed
                }
                product.save(function(err){
                    if(err) res.send(err)

                    res.json({ message: 'Producto Actualizado'});
                });
            })
        })
        .delete(function(req, res){
            Product.remove({_id: req.params.product_id}, function(err, product){
                if(err) return res.send(err);
                
                res.json({message: 'Successfully deleted'});
            })
        });
    
    apiRouter.route('/product/search/:search')
        .get(function(req, res){
            //console.log(req.params.search);
            var re = new RegExp('^'+req.params.search, 'i');
            var query = [{'bar_code': {$regex: re}}, {'cv_product': {$regex: re}}, {'name_prod': {$regex: re}}, {'desc_prod': {$regex: re}}];
            Product.find().or(query).exec(function(err, products){
                if(err) res.send(err);
                
                res.json(products);
            })
        });
        
    apiRouter.route('/products/updatestok')
        .put(function(req, res){
            _.each(req.body, function(prod){
                Product.findById(prod._id, function(err, producto){
                    if(err) res.send(err);
                    producto.stocks = producto.stocks - prod.quantity;
                    producto.save(function(err){
                        if(err) res.send(err);
                    });
                });
            });
            res.json({
                    message: 'Productos actualizados con exito',
                    status: 'success'
                });
        });
    return apiRouter;
}