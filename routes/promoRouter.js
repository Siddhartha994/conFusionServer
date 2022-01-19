//handling REST API endpoints for /Promos, /Promos:promoId 
const express = require('express');
const bodyParser = require('body-Parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');


const Promos = require('../Models/promotions');

const promoRouter = express.Router();    //declares promoRouter as an express Router

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get( (req,res,next) => {
        Promos.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json') ;
            res.json(promos);
        },(err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Promos.create(req.body)
        .then((promo) => {
            console.log('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json') ;
            res.json(promo);
        },(err) => next(err))
        .catch((err) => next(err));
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Promos');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promos.remove({})
            .then((any) => {
                console.log('Deleting all Promos');
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json') ;
                res.json(any);
            },(err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req,res,next) => {
        Promos.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Promos/'+ req.params.promoId);
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = promoRouter;
    