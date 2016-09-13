var Provider = require('../models/data/provider');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/providers')
        .post(function(req, res){
            var provider = new Provider();
            provider.dateRegister = new Date();
            provider.name = req.body.name;
            provider.rfc = req.body.rfc;
            provider.phone = req.body.phone;
            provider.address = req.body.address;
            provider.obs = req.body.obs;
            provider.code = req.body.code;
            provider.providerType = req.body.providerType;
            provider.statusType = req.body.statusType;

            provider.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'Ya existe un provedor con este id'});

                    else
                        return res.send(err)
                }
                res.json({message: 'Proveedor creado'});
            });
        })
        .get(function(req, res){
            Provider.find(function(err, providers){
                if(err) res.send(err);
                
                res.json(providers);
            });
        });

        apiRouter.route('/provider/:id_provider')
            .get(function(req, res){
                Provider.findById(req.params.id_provider, function(err, provider){
                    if(err) res.send(err);

                    res.json(provider);
                })
            })
            .put(function(req, res){
                Provider.findById(req.params.id_provider, function(err, provider){
                    if(err) res.send(err);

                    provider.name = req.body.name;
                    provider.rfc = req.body.rfc;
                    provider.phone = req.body.phone;
                    provider.address = req.body.address;
                    provider.obs = req.body.obs;
                    provider.code = req.body.code;
                    provider.providerType = req.body.providerType;
                    provider.statusType = req.body.statusType;

                    provider.save(function(err){
                    if(err) res.send(err)

                        res.json({ message: 'Provider updated'});
                    });
                });
            })
            .delete(function(req, res){
                Provider.remove({
                    _id: req.params.id_provider
                }, function(err, user){
                    if(err) return res.send(err);

                    res.json({message: 'Successfully deleted'});
                })
            });

        apiRouter.route('/provider/search/:search')
            .get(function(req, res){
                var re = new RegExp('^'+req.params.search, 'i');
                var query = [{'code': {$regex: re}}, {'name': {$regex: re}}, {'rfc': {$regex: re}}];
                Provider.find().or(query).exec(function(err, provider){
                    if(err) res.send(err);
                    
                    res.json(provider);
                })
            })

        
    return apiRouter;
}