const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
require('dotenv').config();
const passport = require('passport')
const todoController = require('../controllers/todoController')


/* GET user items. */
//This grabs all users items and projects. 
router.get('/todos', passport.authenticate('jwt', { session: false }), todoController.get_todos);

//----------------------------------ITEMS-------------------------
//GET single item - needed?
// router.get('/item/:itemId', passport.authenticate('jwt', { session: false }), todoController.get_item);

// POST single item, used for creating an item
router.post('/item', passport.authenticate('jwt', { session: false }), todoController.post_item);

//EDIT single item
router.put('/item/:id', passport.authenticate('jwt', { session: false }), todoController.put_item);

// DELETE single item
router.delete('/item/:id', passport.authenticate('jwt', { session: false }), todoController.delete_item);

//-----------------Projects--------------------------------------------------
//GET user projects
router.get('/proj', passport.authenticate('jwt', { session: false }), todoController.get_projs);

//POST single proj - Creates a project
router.post('/proj', passport.authenticate('jwt', { session: false }), todoController.post_proj);

//PUT single project
router.put('/proj/:id', passport.authenticate('jwt', { session: false }), todoController.put_proj);

//DELETE single proj - Deletes a project - First checks for any dependent items
router.delete('/proj/:id', passport.authenticate('jwt', { session: false }), todoController.delete_proj);


module.exports = router;
