var Sale = require('../models/data/sale');
var Client = require('../models/data/client');
var User = require('../models/data/user');
var Product = require('../models/data/product');

module.exports = function(app, express, _, exec){
    var apiRouter = express.Router();

    apiRouter.route('/sale')
        .post(function(req, res){
            var totalProducts = 0;
            var sale = new Sale();
            var detailSale = [];
            _.each(req.body.listProductsToSales, function(product){
                totalProducts = totalProducts + parseFloat(product.quantity);
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

    apiRouter.route('/sale/:datasearch')
        .get(function(req, res){
            var hasParameters = false;
            var paramSearch = JSON.parse(req.params.datasearch);
            
            var queryGeneral = {};
            var queryDate = {};
            var listProducts = [];
            if(paramSearch.startDate != null){
                hasParameters = true;
                if(paramSearch.endDate != null){
                    var endDateEnd = new Date(paramSearch.endDate);
                    endDateEnd.setDate(endDateEnd.getDate() + 1);
                    _.extend(queryDate, {'$gt': new Date(paramSearch.startDate)});
                    _.extend(queryDate, {'$lt': new Date(endDateEnd)});
                    _.extend(queryGeneral, {'dateSale': queryDate});
                } else {
                    var startDateEnd = new Date(paramSearch.startDate);
                    startDateEnd.setDate(startDateEnd.getDate() + 1);
                    _.extend(queryDate, {'$gt': new Date(paramSearch.startDate)});
                    _.extend(queryDate, {'$lt': new Date(startDateEnd)});
                    _.extend(queryGeneral, {'dateSale': queryDate});
                }
            }
            if(paramSearch.clients.length > 0){
                hasParameters = true;
                var clientsArray = [];
                _.each(paramSearch.clients, function(client){
                    clientsArray.push(client.id);
                });
                _.extend(queryGeneral, {'idClient': {$in: clientsArray}});
            }
            if(paramSearch.users.length > 0){
                hasParameters = true;
                var usersArray = [];
                _.each(paramSearch.users, function(user){
                    usersArray.push(user.id);
                });
                _.extend(queryGeneral, {'idUser': {$in: usersArray}});
            }
            if(paramSearch.products.length > 0){
                hasParameters = true;
                var productsArray = [];
                _.each(paramSearch.products, function(product){
                    productsArray.push(product.bar_code);
                });
                _.extend(queryGeneral, {'detailSale.bar_code': {$in: productsArray}});
            }
            if(paramSearch.cash || paramSearch.credit){
                hasParameters = true;
                if(paramSearch.cash)
                    _.extend(queryGeneral, {'typeSale': 1});
                else
                    _.extend(queryGeneral, {'typeSale': 2});
            }

            console.log(queryGeneral);
            if(hasParameters){
                Sale.find(queryGeneral).sort({'dateSale': 'asc'}).exec(function(err, sales){
                    if(err) res.send(err);
                    addDetailSales(sales, listProducts, res);
                });
            } else {
                Sale.find({}, null, {sort: {'dateSale': 1}}, function(err, sales){
                    if(err) res.send(err);
                    addDetailSales(sales, listProducts, res);
                });
            }
        });

        var addDetailSales = function(sales, listProducts, res){
            var userToFind = _.uniq(_.pluck(sales, 'idUser'));
            var clientToFind = _.uniq(_.pluck(sales, 'idClient'));
            var monthNames = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"];
            //Busca los clientes en la lista de venta
            Client.find({'idClient': {'$in': clientToFind}}, function(err, resClients){
                if(err) res.send(err);
                //Busca los usuarios en la lista de ventas
                User.find({'_id': {'$in': userToFind}}, function(err, rUsers){
                    if(err) res.send(err);
                    var resSales = JSON.parse(JSON.stringify(sales));
                    var resUsers = JSON.parse(JSON.stringify(rUsers));
                    //Agrega detalles de los clientes y usuarios a la lista de venta
                    _.each(resSales, function(saleNow, indexSales){
                        if(_.findWhere(resClients, {idClient: saleNow.idClient})){
                            _.extend(saleNow, {detailClient: _.findWhere(resClients, {idClient: saleNow.idClient})});
                        } else {
                            _.extend(saleNow, {detailClient: 'Venta al publico'});
                        }
                        _.extend(saleNow, {detailUser: _.findWhere(resUsers, {_id: saleNow.idUser})});
                        //Agrega delles de los productos a la lista de ventas
                        _.each(saleNow.detailSale, function(prod, indexProducts){
                            listProducts.push(prod.bar_code);
                        });
                        var dateNoFormat = new Date(saleNow.dateSale);
                        _.extend(saleNow, {dateSaleFormat: dateNoFormat.getDate() + '-' + monthNames[dateNoFormat.getMonth()] + '-' + dateNoFormat.getFullYear()});
                    });
                    listProducts = _.uniq(listProducts);
                    //Agrega delles de los productos a la lista de ventas
                    findProductDetail(listProducts, resSales, res);
                });
            });
        }

        var findProductDetail = function (listprod, resSales, res) {
            Product.find({'bar_code': {'$in': listprod}}, function (err, rProduct) {
                var resProduct = JSON.parse(JSON.stringify(rProduct));
                _.each(resSales, function(saleNow, indexSales){
                    _.each(saleNow.detailSale, function(prod, indexProducts){
                        _.extend(saleNow.detailSale[indexProducts], {detailProduct: _.findWhere(resProduct, {bar_code: prod.bar_code})});
                    })
                })
                res.json(resSales);
                /*exec('java -jar ./TestNodeJs.jar asdasdasdasdsadsada', function (error, stdout, stderr){
                    console.log('Output -> ' + stdout);
                    res.json(resSales);
                    if (error !== null) {
                        console.log("Error -> " + error);
                    }
                })*/
            });
        }

    return apiRouter;
}