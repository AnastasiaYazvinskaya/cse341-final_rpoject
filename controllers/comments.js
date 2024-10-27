const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getComments = async (req, res, next) => {
    //#swagger.tags=['Comments']
    try {
        const recipeID = req.query.recipeID;
        const query = {};
        
        if (!!recipeID) query.recipeID = recipeID;

        const result = await mongodb.getDb().db('cse341-final_project').collection('comments').find(query);
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getComment = async (req, res, next) => {
    //#swagger.tags=['Comments']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('comments').find({_id: id});
        if (!result) return res.status(404).json({ message: 'Comment not found' });
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addComment = async (req, res, next) => {
    //#swagger.tags=['Comments']
    try {
        const newComment = {
            content: req.body.content,
            userID: req.body.userID,
            recipeID: req.body.recipeID,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('comments').insertOne(newComment);
        
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Comment creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editComment = async (req, res, next) => {
    //#swagger.tags=['Comments']
    try {
        const id = new ObjectId(req.params.id);
        const existingComment = await mongodb.getDb().db('cse341-final_project').collection('comments').find({_id: id}).toArray();
        if (existingComment.length === 0) return res.status(404).json({ message: 'Comment not found' });
        const Comment = {
            content: req.body.name,
            updatedAt: new Date()
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('comments').replaceOne({_id: id}, Comment);
        if (result.modifiedCount > 0) {
            console.log(`Comment updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(404).json('Comment not found');
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};
const deleteComment = async (req, res, next) => {
    //#swagger.tags=['Comments']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('comments').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`Comment deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(404).json('Comment not found');
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

module.exports = { getComments, getComment, addComment, editComment, deleteComment };