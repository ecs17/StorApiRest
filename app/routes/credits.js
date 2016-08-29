var Credit = require('../models/data/credit');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/credit')
        .post(function(req, res){
            var credit = new Credit();
            credit.dateStart = new Date();
            credit.dateLastSale = new Date();
            credit.amountCredit = req.body.amountCredit;
            credit.idClient = req.body.idClient;
            credit.statusCredit = true;
            credit.detailCredit = req.body.detailCredit;
            
            credit.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, status: 'Ya existe un producto con el codigo de barras'});

                    else
                        return res.send(err)
                }
                res.json({message: 'Cuenta de Credito Creada'});
            });
        });

    apiRouter.route('/credit/:credit_id')
        .put(function(req, res){
            Credit.find({'idCredit': req.params.credit_id}, function(err, credit){
                if(err) res.send(err);
                credit[0].amountCredit = req.body.amountCredit;
                credit[0].detailCredit.push({idSale: req.body.detailCredit[0].idSale})
                credit[0].dateLastSale = new Date();

                credit[0].save(function(err){
                    if(err) res.send(err)

                    res.json({ message: 'Credito Actualizado'});
                });
            })
        })

    apiRouter.route('/credit/:idClient')
        .get(function(req, res){
            Credit.find().and([{'idClient': req.params.idClient}, {'statusCredit': true}]).exec(function(err, credit){
                if(err) res.send(err);
                
                console.log(credit);
                res.json(credit);
            });
        });
    return apiRouter;
}