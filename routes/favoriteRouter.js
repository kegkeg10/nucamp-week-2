const express = require('express')
const Favorites = require('../models/favorite')
const authenticate = require('../authenticate')
const cors = require('./cors');
const { response } = require('express');


const favoriteRouter = express.Router();


favoriteRouter.route('/')
    .options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find( { user: req.user._id } )
        .populate('user')
        .populate('campsites')
        .then(favorites => { 
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        })
        .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({ user: req.user._id }) 
        .then(favorites => {
            if(favorites) {
                req.body.forEach(fav => {
                    if (!favorites.campsites.includes(fav._id)) {
                        favorites.campsites.push(fav._id)
                    }
                });
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites)
                })
                .catch(err => next(err))
            } else {
                favorites.create({ user: req.user._id })
                .then(favorites => {
                    req.body.forEach(fav => {
                        favorites.campsites.push(fav_id)
                    });
                favorites.save()
                .then(favorites => {
                    console.log('Favorite Created', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites)
                })
                .catch(err => next(err))
                })
            }
        })
        .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
        Favorites.findOneAndDelete({user: req.user._id })
        .then (response => {
            res.statusCode = 200;
            if(response) {
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.end('You don\'t have any favorites to delete')
            }
        })
        .catch(err => next(err))
    })


favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain');
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .post (cors.corsWithOptions, authenticate.verifyUser,(req,res) => {
        Favorites.findOne({user: req.user._id })
        .then(favorites => {
            if(favorites) {
                if(!favorites.campsites.includes(req.params.campsiteId)) {
                    favorites.campsites.push(req.params.campsiteId)
                    favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites)
                })
                .catch(err => next(err))
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That Campsite is already favorited');
                }
            } else {
                Favorites.create({user: req.user._id })
                .then(favorites => {
                    req.body.forEach(fav => {
                        favorites.campsites.push(fav._id)
                    });
                    favorites.save()
                    .then(favorites => {
                        console.log('Favorites Created', favorites);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites)
                    })
                    .catch(err => next(err));
                })
            }
        })
    })
    
    .put(cors.corsWithOptions, authenticate.verifyUser, (req,res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`PUT operation not supported on /favorites'/${req.params.campsiteId}`)
    })
    
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res, next) => {
        Favorites.findOne({user: req.user._id })
        .then(favorites => {
            if(favorites) {
                favorites.campsites = favorites.campsites.filter(fav => !favorites)
                favorites.save()
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites)
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You Have No favorites');
            }
        })
        .catch(err => next(err));
    })


module.exports = favoriteRouter;