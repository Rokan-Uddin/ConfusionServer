const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,	(req, res, next) => {
			Favorites.find({user: req.user._id})
			.then((dish)=> {
				if (dish.length>0) { 
					Favorites.find({user:req.user._id})
					.then((favoritedish)=> {
						for (var i = (req.body.length -1); i >= 0; i--) {
			                favoritedish[0].dishes.push(req.body[i]._id);
			            }
			            favoritedish[0].save();
			            res.json(favoritedish);
					}, (err) => next(err))
					.catch((err) => next(err));
				}
				else{
					Favorites.create({
						user : req.user._id
					})
					.then((favoritedish)=> {
						for (var i = (req.body.length -1); i >= 0; i--) {
			                favoritedish.dishes.push(req.body[i]._id);
			            }
			            favoritedish.save();
			            res.json(favoritedish);
					}, (err) => next(err))
					.catch((err) => next(err));
				}
			})
	})
.put(authenticate.verifyUser, (req,res,next) => {
	res.statusCode =403;
	res.end('PUT operation is not supported');
})
.delete(authenticate.verifyUser, (req,res,next) => {
	Favorites.remove({user:req.user._id})
	.then(()=> {
		res.statusCode =200;
		res.end('List Deleted');
	})

});
favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser, (req, res, next) => {
	res.statusCode=403;
	res.end('GET operation is not supported');

})
.post(authenticate.verifyUser, (req,res,next) => {
			Favorites.find({user: req.user._id})
			.then((dish)=> {
				if (dish.length>0) { 
					{	
						for (var i = dish[0].dishes.length - 1; i >= 0; i--) {
								if(dish[0].dishes[i] == req.params.dishId){
							 	res.end('The dish already in favorite list');
				 			 }
						}					
			            dish[0].dishes.push(req.params.dishId);			            
			            dish[0].save();
			            res.json(dish);
					}					
				}
				else{
					Favorites.create({
						user : req.user._id
					})
					.then((favoritedish)=> {						
			            favoritedish.dishes.push(req.params.dishId);		            
			            favoritedish.save();
			            res.json(favoritedish);
					}, (err) => next(err))
					.catch((err) => next(err));
				}
			})
})
.put(authenticate.verifyUser, (req,res,next) => {
	res.statusCode=403;
	res.end('PUT operation is not supported');

})
.delete(authenticate.verifyUser, (req,res,next)=> {
		Favorites.find({user: req.user._id})
			.then((dish)=> {
				if (dish.length>0) { 
					{	
						for (var i = dish[0].dishes.length - 1; i >= 0; i--) {
								if(dish[0].dishes[i] == req.params.dishId){
							 	dish[0].dishes.remove(req.params.dishId);
				 			 }
						}
						dish[0].save();					
			            res.json(dish);
					}					
				}
				else{
					res.statusCode=200;
					res.end('Your favorite list empty');
				}
			})

});
module.exports = favoriteRouter;