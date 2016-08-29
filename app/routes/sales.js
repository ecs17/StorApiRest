var Sale = require('../models/data/sale');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/sale')
        .post(function(req, res){
            var totalProducts = 0;
            var sale = new Sale();
            var detailSale = [];
            _.each(req.body.listProductsToSales, function(product){
                totalProducts = totalProducts + product.quantity;
                detailSale.push({bar_code: product.bar_code, quantity: product.quantity})
            });
            sale.dateSale = new Date();
            sale.totalAmount = req.body.amountSale;
            sale.idClient = req.body.idClient;
            sale.idUser = req.body.idUser;
            sale.totalProducts = totalProducts;
            sale.comments = req.body.comments;
            sale.typeSale = req.body.typeSale;
            sale.detailSale = detailSale;
            
            sale.save(function(err){
                if(err)return res.send(err)
                
                console.log('Venta guardada');
                res.json({
                    message: 'Venta Guardada con exito',
                    status: 'success',
                    idSale: sale.idSale
                });
           });
        });
    return apiRouter;
}