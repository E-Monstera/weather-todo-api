const Item = require('../models/Item');
const Project = require('../models/Project');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const async = require('async');
const { findByIdAndDelete } = require('../models/Item');

// Method to grab all todos for a single user
exports.get_planner = function (req, res, next) {
    //Grab all projects and items for a user
    async.parallel({
        projects: function (callback) {
            Project.find({ author: req.user._id }, callback)
        },
        items: function (callback) {
            Item.find({ author: req.user._id }).populate('project', 'title').exec(callback)
        },
        notes: function(callback) {
            Note.find({ author: req.user._id}, callback)
        }
    }, function (err, results) {
        if (err) {  //If error, forward error
            return next(err)
        } else {
            res.status(200).json({ items: results.items, projects:results.projects, notes:results.notes })
        }


    })
}


//---------------------------------------------------------------
//Methods for managing projects

//Method to grab all projects for a given user
exports.get_projs = function (req, res, next) {
    Project.find({ author: req.user._id })
        .exec((err, results) => {
            if (err) {
                return next(err)
            } else {
                res.status(200).json(results)
            }

        })
}

//Method to create a new project
exports.post_proj = [
    body('title', 'Title is required').escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {
            //Create the new project and save to database
            let newProj = new Project({
                author: req.user._id,
                title: req.body.title,
            })
                .save((err, result) => {
                    if (err) {
                        return next(err)
                    } else {
                        res.status(200).json({ message: 'New project created', project: result })
                    }
                })
        }
    }
];

//Method to edit an existing project
exports.put_proj = [
    body('title', 'Title is required').escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {
            //Success, now edit project
            let project = {
                title: req.body.title,
                author: req.user._id,
                _id: req.params.id
            }
            Project.findByIdAndUpdate(req.params.id, project, {}, (err) => {
                if (err) {
                    if (err.kind === 'ObjectId') {
                        res.status(400).json({ message: 'Invalid item id' })
                    } else {
                        return next(err)
                    }
                } else {
                    //Project successfully updated
                    res.status(200).json({ message: 'Project updated', project })
                }
            })
        }
    }
];


//Function to delete a project, only works if project has no associated items
exports.delete_proj = function (req, res, next) {
    Item.find({ project: req.params.id })
        .exec((err, results) => {
            if (err) {
                if (err.kind === 'ObjectId') {
                    //Invalid id was entered
                    res.status(400).json({ message: 'Incorrect project id' })
                }
                return next(err)
            } else {
                if (results.length === 0) {
                    //No associated items! Delete post
                    Project.findByIdAndDelete(req.params.id, (err) => {
                        if (err) {
                            return next(err)
                        } else {
                            res.status(200).json({ message: 'Project deleted' })
                        }
                    })
                } else {
                    // The project has associated items, delete these first
                    res.status(400).json({ message: 'Please delete items first', items: results })
                }
            }
        })
}
//-------------------------------------------------------
//Methods for handling items
//Method to create a new item
exports.post_item = [
    body('title', 'Title is required').escape().trim(),
    body('desc').escape().trim(),

    (req, res, next) => {
        console.log('posting item')
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {    //Create the new item and save to database
            //Check if user added a description
            let desc = '';
            if (req.body.desc) {
                desc = req.body.desc;
            }

            //Check if item belongs to a project
            let proj = null;
            if (req.body.project !== 'none') {
                proj = req.body.project
            }
            let newItem = new Item({
                title: req.body.title,
                desc: desc,
                priority: req.body.priority,
                project: proj,
                author: req.user._id,
                due_date: req.body.due_date,
                completed: false,
            })
                .save((err, result) => {
                    if (err) {
                        console.log('error')
                        console.log(err)
                        return next(err)
                    } else {
                        console.log('success')
                        res.status(200).json({ message: 'new item created', item: result })
                    }
                })

        }
    }
];

exports.put_item = [
    body('title', 'Title is required').escape().trim(),
    body('desc').escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {    //Update the item
            Item.findById(req.params.id)
                .exec((err, results) => {
                    if (err) {
                        // Invalid item id error
                        if (err.kind === 'ObjectId') {
                            res.status(400).json({ message: 'Invalid item id' })
                        } else {
                            return next(err)
                        }
                    } else {
                        // Success! Find what's been updated
                        console.log(results)
                        let itemTemp = JSON.parse(JSON.stringify(results));
                        let item = Object.assign({}, itemTemp);
                        if (req.body.title) {            //User changed title
                            item.title = req.body.title;
                        }
                        if (req.body.desc) {            //User changed description
                            item.desc = req.body.desc
                        }
                        if (req.body.due_date) {            //User changed due_date
                            item.due_date = req.body.due_date
                        }
                        if (req.body.priority) {            //User changed priority
                            item.priority = req.body.priority
                        }
                        if (req.body.project) {             //User changed associated project
                            item.project = req.body.project
                        }
                        item.completed = req.body.completed

                        //Update item
                        Item.findByIdAndUpdate(req.params.id, item, {returnDocument:'after'})
                        .populate('project', 'title')
                        .exec(function(err, result)  {
                            if (err) {
                                return next(err)
                            } else {
                                res.status(200).json({ message: 'item updated', item: result })
                            }
                        })
                    }
                })
        }
    }
]

//Method to delete an item
exports.delete_item = function (req, res, next) {
    Item.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            if (err.kind === 'ObjectId') {
                res.status(400).json({ message: 'Invalid item id' })
            } else {
                return next(err)
            }
        } else {
            res.status(200).json({ message: 'Item deleted' })
        }
    })
}