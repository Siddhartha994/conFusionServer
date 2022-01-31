var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./Models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt; 
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');

exports.Local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};
var opts = {};//options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//describes how token should be extracted from header
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done)=>{  //verify jwt payload,done = callback function
        console.log('Jwt Payload: ', jwt_payload);
        User.findOne({_id: jwt_payload._id},(err,user)=>{// _id comes from Jwt payload, being searched in mongoDb
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null, user);
            }
            else{
                return done(null,false);
            }
        });
    }));
exports.verifyUser = passport.authenticate('jwt',{session: false});//authenticates incoming req// Uses token to authenticate
exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin)
        next();
    else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}//This function will check an ordinary user to see if s/he has Admin privileges.

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));