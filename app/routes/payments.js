var Payment = require('../models/data/payment');
var Credit = require('../models/data/credit');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/payment')
        .post(function(req, res){
            var payment = new Payment();
            console.log(req.body.amountCredit > req.body.amountPayment);
            console.log(req.body.amountCredit + ' - ' + req.body.amountPayment);
            var newAmountCredit = req.body.amountCredit - req.body.amountPayment;
            if(req.body.amountCredit > req.body.amountPayment){
                var credit = new Credit();
                credit.dateStart = new Date();
                credit.dateLastSale = new Date();
                credit.amountCredit = newAmountCredit;
                credit.idClient = req.body.idClient;
                credit.statusCredit = true;
                credit.residue = newAmountCredit;
                
                credit.save(function(errCredit){
                    if(errCredit){
                        return res.send(errCredit)
                    }

                    payment.date = new Date();
                    payment.amountCredit = req.body.amountCredit;
                    payment.amountPayment = req.body.amountPayment;
                    payment.amountPayWith = req.body.amountPayWith;
                    payment.idUser = req.body.idUser;
                    payment.idCredit = req.body.idCredit;
                    payment.nowIdCredit = credit.idCredit;
                    console.log(payment);
                    payment.save(function(errPayment){
                        if(errPayment)
                            return res.send(errPayment);

                        updateCredit(req.body.idCredit, res, req.body.amountPayment);
                    });
                });
            } else {
                payment.date = new Date();
                payment.amountCredit = req.body.amountCredit;
                payment.amountPayment = req.body.amountPayment;
                payment.amountPayWith = req.body.amountPayWith;
                payment.idUser = req.body.idUser;
                payment.idCredit = req.body.idCredit;
                
                payment.save(function(err){
                    if(err)
                        return res.send(err);

                    updateCredit(req.body.idCredit, res, req.body.amountPayment);
                });
            }
        });

        var updateCredit = function(idCredit, res, amountPayment){
            Credit.find({'idCredit': idCredit}, function(err, credit){
                if(err) res.send(err);

                credit[0].statusCredit = false;
                credit[0].payment = amountPayment;
                credit[0].datepayment = new Date();

                credit[0].save(function(err){
                    if(err) res.send(err)

                    res.json({ message: 'Credito Actualizado'});
                });
            })
        }
    return apiRouter;
}