const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
const passport = require('passport')
const todoController = require('../controllers/todoController')
const noteController = require('../controllers/noteController')


/* GET user items. */
//This grabs all users items and projects. 
router.get('/todos', passport.authenticate('jwt', { session: false }), todoController.get_planner);

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

//-----------------Notes--------------------------------------------------
//GET user notes
router.get('/notes', passport.authenticate('jwt', { session: false }), noteController.get_notes);

//POST single note - Creates a note
router.post('/note', passport.authenticate('jwt', { session: false }), noteController.post_note);

//PUT single note
router.put('/note/:id', passport.authenticate('jwt', { session: false }), noteController.put_note);

//DELETE single note - Deletes a note 
router.delete('/note/:id', passport.authenticate('jwt', { session: false }), noteController.delete_note);


module.exports = router;
