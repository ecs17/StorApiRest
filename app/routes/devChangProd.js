var Devchangprod = require('../models/data/devchangprod');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/devAndChange')
        .post(function(req, res){
            var devchangprod = new Devchangprod();
            devchangprod.dateTransact = new Date();
            devchangprod.idUser = req.body.idUser;
            devchangprod.idProvider = req.body.idProvider;
            devchangprod.bar_code = req.body.bar_code;
            devchangprod.stoksNow = req.body.stoksNow;
            devchangprod.stoksNew = req.body.stoksNew;
            devchangprod.refund = req.body.refund;
            devchangprod.change = req.body.change;
            devchangprod.obs = req.body.obs;
            if(devchangprod.refund !== 0 && devchangprod.change !== 0){
                devchangprod.typeTransact = 3;
            } else {
                if(devchangprod.refund !== 0){
                    devchangprod.typeTransact = 1;
                } else {
                    devchangprod.typeTransact = 2;
                }
            }
            
            devchangprod.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'Ya existe un producto con el codigo de barras'});
                    else
                        return res.send(err)
                }
                res.json({message: 'Movimiento con exito'});
            });
        })

    return apiRouter;
}