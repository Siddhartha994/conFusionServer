var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./Models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt; 
var jwt = require('jsonwebtoken');

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