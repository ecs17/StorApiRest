var Sale = require('../models/data/sale');
var User = require('../models/data/user');
var Product = require('../models/data/product');
var salesUtil = module.exports = {};

salesUtil.addDetailsCredit = function(credit, _, res, sendCreditDetail){
    var idsSales = [];
    _.each(credit[0].detailCredit, function(saleDetail){
        idsSales.push(saleDetail.idSale);
    });
    Sale.find({'idSale': {'$in': idsSales}}, function (err, saleD){
        if(err) res.send(err)
        addDetailSales(saleD, res, credit, sendCreditDetail, _);
    });
}

var addDetailSales = function (sales, res, credit, sendCreditDetail, _) {
    var listProducts = [];
    var userToFind = _.uniq(_.pluck(sales, 'idUser'));
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    //Busca los usuarios en la lista de ventas
    User.find({ '_id': { '$in': userToFind } }, function (err, rUsers) {
        if (err) res.send(err);
        var resSales = JSON.parse(JSON.stringify(sales));
        var resUsers = JSON.parse(JSON.stringify(rUsers));
        //Agrega detalles de los clientes y usuarios a la lista de venta
        _.each(resSales, function (saleNow, indexSales) {
            _.extend(saleNow, { detailUser: _.findWhere(resUsers, { _id: saleNow.idUser }) });
            //Agrega delles de los productos a la lista de ventas
            _.each(saleNow.detailSale, function (prod, indexProducts) {
                listProducts.push(prod.bar_code);
            });
            var dateNoFormat = new Date(saleNow.dateSale);
            _.extend(saleNow, { dateSaleFormat: dateNoFormat.getDate() + '-' + monthNames[dateNoFormat.getMonth()] + '-' + dateNoFormat.getFullYear() });
        });
        listProducts = _.uniq(listProducts);
        //Agrega delles de los productos a la lista de ventas
        findProductDetail(listProducts, resSales, res, credit, sendCreditDetail, _);
    });
}

var findProductDetail = function (listprod, resSales, res, credit, sendCreditDetail, _) {
    Product.find({ 'bar_code': { '$in': listprod } }, function (err, rProduct) {
        var resProduct = JSON.parse(JSON.stringify(rProduct));
        _.each(resSales, function (saleNow, indexSales) {
            _.each(saleNow.detailSale, function (prod, indexProducts) {
                _.extend(saleNow.detailSale[indexProducts], { detailProduct: _.findWhere(resProduct, { bar_code: prod.bar_code }) });
            })
        })
        _.each(credit[0].detailCredit, function(saleDetail){
            _.extend(saleDetail, {sDetail: _.findWhere(resSales, {idSale: saleDetail.idSale})});
        });
        sendCreditDetail(credit, res);
    });
}