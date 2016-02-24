var User = require('../models/data/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var superSecret = config.secret;

module.exports = function(app, express){
    var apiRouter = express.Router();
    
    apiRouter.get('/', function(req, res){
        res.json({ message: 'hooray! welcome to our api!'});
    });
    
    apiRouter.post('/authenticate', function(req, res){
        console.log(req.body.userName);
        
        User.findOne({
            userName: req.body.userName
        }).select('name userName password userType').exec(function(err, user){
            if(err) throw err;

            if(!user){
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if(user) {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign(user, superSecret, {
                        expiresInMinutes: 1440
                    });
                    console.log(user)
                    res.json({
                        success: true,
                        name: user.name,
                        _id: user._id,
                        userName: user.userName,
                        type: user.userType,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });
    
    apiRouter.use(function(req, res, next){
        console.log('Somebody just came to our app!');
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, superSecret, function(err, decoded){
                if(err){
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    });
    
    apiRouter.route('/users')
        .post(function(req, res){
            var user = new User();

            user.name = req.body.name;
            user.userName = req.body.userName;
            user.password = req.body.password;
            user.admin = req.body.admin;
            user.location = req.body.location;
            user.userType = req.body.userType;

            user.save(function(err){
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
            User.find(function(err, users){
                if(err) res.send(err);

                res.json(users);
            })
        });
    
    apiRouter.route('/users/:user_id')
        .get(function(req, res){
            User.findById(req.params.user_id, function(err, user){
                if(err) res.send(err);

                res.json(user);
            })
        })
        .put(function(req, res){
            User.findById(req.params.user_id, function(err, user){
                if(err) res.send(err);

                if(req.body.name) user.name = req.body.name;
                if(req.body.userName) user.userName = req.body.userName;
                if(req.body.password) user.password = req.body.password;
                if(req.body.location) user.location = req.body.location;
                if(req.body.userType) user.userType = req.body.userType;
                user.admin = req.body.admin;

                user.save(function(err){
                    if(err) res.send(err)

                    res.json({ message: 'User updated'});
                });
            });
        })
        .delete(function(req, res){
            User.remove({
                _id: req.params.user_id
            }, function(err, user){
                if(err) return res.send(err);

                res.json({message: 'Successfully deleted'});
            })
        });
    
    return apiRouter;
}