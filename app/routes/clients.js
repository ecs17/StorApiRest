var Client = require('../models/data/client');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/client')
        .post(function(req, res){
            var client = new Client();
            client.name = req.body.name;
            client.ap1 = req.body.ap1;
            client.ap2 = req.body.ap2;
            client.dateReg = new Date();
            client.street = req.body.street;
            client.col = req.body.col;
            client.num = req.body.num;
            client.phone = req.body.phone;
            client.mun = req.body.mun;
            client.ent = req.body.ent;
            client.cp = req.body.cp;
            client.rfc = req.body.rfc;
            client.limitCredit = parseFloat(req.body.limitCredit);
            client.coments = req.body.coments;
            client.clientType = req.body.clientType;
            
            client.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'Ya existe un producto con el codigo de barras'});

                    else
                        return res.send(err)
                }
                res.json({message: 'Client creado'});
            });
        })
        .get(function(req, res){
            Client.find(function(err, clients){
                if(err) res.send(err);
                
                res.json(clients);
            });
        });

    apiRouter.route('/clients/:client_id')
        .get(function(req, res){
            Client.findById(req.params.client_id, function(err, client){
                if(err) res.send(err);

                res.json(client);
            })
        })
        .put(function(req, res){
            Client.findById(req.params.client_id, function(err, client){
                if(err) res.send(err);

                client.name = req.body.name;
                client.ap1 = req.body.ap1;
                client.ap2 = req.body.ap2;
                client.street = req.body.street;
                client.col = req.body.col;
                client.num = req.body.num;
                client.phone = req.body.phone;
                client.mun = req.body.mun;
                client.ent = req.body.ent;
                client.cp = req.body.cp;
                client.rfc = req.body.rfc;
                client.limitCredit = req.body.limitCredit;
                client.coments = req.body.coments;
                client.clientType = req.body.clientType;

                client.save(function(err){
                    if(err) res.send(err)

                    res.json({ message: 'Client updated'});
                });
            });
        })
        .delete(function(req, res){
            Client.remove({
                _id: req.params.client_id
            }, function(err, user){
                if(err) return res.send(err);

                res.json({message: 'Successfully deleted'});
            })
        });

    apiRouter.route('/client/search/:search')
        .get(function(req, res){
            //console.log(req.params.search);
            var re = new RegExp('^'+req.params.search, 'i');
            var queryOk = {$and: [{$or: [{'name': {$regex: re}}, {'ap1': {$regex: re}}, {'ap2': {$regex: re}}]},
                                    {'clientType.idType': {$in: [1, 2]}}]};
            var query = [{'name': {$regex: re}}, {'ap1': {$regex: re}}, {'ap2': {$regex: re}}];
           // Client.find().or(query).exec(function(err, clients){
            Client.find(queryOk, function(err, clients){
                if(err) res.send(err);

                res.json(clients);
            })
        });

    apiRouter.route('/clientupdatcredit/:idClient')
        .put(function(req, res){
            var clientType = {
                description : "Activo Con Deuda",
                abbrev : "ACTCD",
                idType : 2
            }
            Client.update({'idClient': req.params.idClient}, {'clientType': clientType}, function(err){
                if(err) res.send(err);
                
                res.json({ message: 'Client updated'});
            })
        })
    return apiRouter;
}