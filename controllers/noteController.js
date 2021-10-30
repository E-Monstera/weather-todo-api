const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

exports.get_notes = function (req, res, next) {
    Note.find({ author: req.user._id })
        .exec((err, results) => {
            if (err) {
                return next(err)
            } else {
                res.status(200).json(results)
            }
        })
}

exports.post_note = [
    body('content', 'Content is required').escape().trim(),
    body('title', 'Title is required').escape().trim(),

    (req, res, next) => {
        console.log('triggered')
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {
            new Note({
                content: req.body.content,
                author: req.user._id,
                title: req.body.title
            })
            .save((err, result) => {
                if (err) {
                    return next(err)
                } else {
                    res.status(200).json({message: 'Note created', note: result})
                }
            })
        }
    }
]

exports.put_note = [
    body('content', 'Content is required').escape().trim(),
    body('title', 'Title is required').escape().trim(),

    (req, res, next) => {
        // If there were errors, reject the submission and return the user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errArr: errors.array() })
        } else {
            let note = {
                content: req.body.content,
                title: req.body.title,
                author: req.user._id,
                _id: req.params.id,
            }
            Note.findByIdAndUpdate(req.params.id, note, {returnDocument:'after'}, (err, result) => {
                if (err) {
                    if (err.kind === 'ObjectId') {
                        res.status(400).json({ message: 'Invalid item id' })
                    } else {
                        return next(err)
                    }
                } else {
                    //Note successfully updated
                    console.log(result)
                    res.status(200).json({ message: 'Note updated', note:result })
                }
            })


            
        }
    }
]

exports.delete_note = function (req, res, next) {
    Note.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            return next(err)
        } else {
            res.status(200).json({message: 'Note deleted'})
        }
    })
}