var UserTypeCatalog = require('../models/catalogs/catlg_UserType');
var ProdPresCatalog = require('../models/catalogs/catlg_ProdPres');
var MeasureTypeCatalog = require('../models/catalogs/catlg_MeasureType');
var ClientTypeCatalog = require('../models/catalogs/catlg_ClientType');
var ProviderTypeCatalog = require('../models/catalogs/catlg_ProviderType');
var ProviderStCatalog = require('../models/catalogs/catlg_ProviderSt');

module.exports = function(app, express){
    var apiRouter = express.Router();
    apiRouter.route('/userTypeCatalog')
        .post(function(req, res){
            var catalog = new UserTypeCatalog();

            catalog.abbrev = "Test";
            catalog.description = "Test";
            catalog.idType = 6;

            catalog.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'A user with that\ username already exists'});

                    else
                        return res.send(err)
                }
                res.json({message: 'User created!'});
            })
        })
        .get(function(req, res){
            UserTypeCatalog.find(function(err, userTC){
                if(err) res.send(err);

                res.json(userTC);
            })
        });
    
    apiRouter.route('/clientTypeCatalog')
        .post(function(req, res){
            var catalog = new ClientTypeCatalog();

            catalog.abbrev = "Test";
            catalog.description = "Test";
            catalog.idType = 6;

            catalog.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'A client with that\ username already exists'});

                    else
                        return res.send(err)
                }
                res.json({message: 'Client created!'});
            })
        })
        .get(function(req, res){
            ClientTypeCatalog.find(function(err, clientTC){
                if(err) res.send(err);

                res.json(clientTC);
            })
        });
    
    apiRouter.route('/providerTypeCatalog')
        .post(function(req, res){
            var catalog = new ProviderTypeCatalog();

            catalog.abbrev = "Test";
            catalog.description = "Test";
            catalog.idType = 6;

            catalog.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'A user with that\ username already exists'});

                    else
                        return res.send(err)
                }
                res.json({message: 'User created!'});
            })
        })
        .get(function(req, res){
            ProviderTypeCatalog.find(function(err, providertType){
                if(err) res.send(err);

                res.json(providertType);
            })
        });
    
    apiRouter.route('/providerStatusCatalog')
        .post(function(req, res){
            var catalog = new providerStCatalog();

            catalog.abbrev = "Test";
            catalog.description = "Test";
            catalog.idType = 6;

            catalog.save(function(err){
                if(err){
                    if(err.code == 11000)
                        return res.json({success: false, message: 'A user with that\ username already exists'});

                    else
                        return res.send(err)
                }
                res.json({message: 'User created!'});
            })
        })
        .get(function(req, res){
            ProviderStCatalog.find(function(err, providerStatus){
                if(err) res.send(err);
                
                res.json(providerStatus);
            })
        });
    
    apiRouter.route('/measureType_prod')
        .get(function(req, res){
            MeasureTypeCatalog.find(function(err, prodPres){
                if(err) res.send(err);
                
                res.json(prodPres);
            })
        });
    
    return apiRouter;
}