const express = require('express');
const bodyParser = require('body-parser');

const Favorites = require('../models/favorite');

var authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options( (req,res) => { res.sendStatus(200); })
.get( authenticate.verifyUser, (req,res,next) => {
    Favorites.find({})
    .populate('userinfo')
    .populate('dishDetails')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"userinfo": req.user._id})
    .then((favorite) => {
        if(favorite) {
            for(var i = 0;i < req.body.length; i++) {
                if (favorite.dishDetails.indexOf(req.body[i]._id) === -1) {
                    favorite.dishDetails.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
        else {
            Favorites.create({"userinfo": req.user._id, "dishDetails": req.body})
            .then((favorite) => {
                console.log('Favorite Created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"userinfo": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

favoriteRouter.route('/:dishId')
.options( (req, res) => { res.statusCode(200); })
.get( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"userinfo": req.user._id})
    .then((favorite) => {
        if(favorite) {
            if(favorite.dishDetails.indexOf(req.params.dishId) === -1) {
                favorite.dishDetails.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
            }, (err) => next(err))
        }
        
        }else {
            Favorites.create({"userinfo": req.user._id, "dishDetails": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
        }, (err) => next(err))
    .catch((err) => next(err));
})
.put( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"userinfo": req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.dishDetails.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishDetails.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;

