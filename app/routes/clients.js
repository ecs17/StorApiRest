var Client = require('../models/data/client');

module.exports = function(app, express, _){
    var apiRouter = express.Router();

    apiRouter.route('/client/search/:search')
        .get(function(req, res){
            //console.log(req.params.search);
            var re = new RegExp('^'+req.params.search, 'i');
            var query = [{'name': {$regex: re}}, {'ap1': {$regex: re}}, {'ap2': {$regex: re}}];
            Client.find().or(query).exec(function(err, clients){
                if(err) res.send(err);
                
                res.json(clients);
            })
        });
    return apiRouter;
}