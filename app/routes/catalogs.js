var UserTypeCatalog = require('../models/catalogs/catlg_UserType');
var ProdPresCatalog = require('../models/catalogs/catlg_ProdPres');
var MeasureTypeCatalog = require('../models/catalogs/catlg_MeasureType');

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
    
    apiRouter.route('/catlg_prodPres')
        .post(function(req, res){
            var catalog = new ProdPresCatalog();

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
            ProdPresCatalog.find(function(err, prodPres){
                if(err) res.send(err);
                
                res.json(prodPres);
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