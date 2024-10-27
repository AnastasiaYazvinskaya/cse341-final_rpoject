const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getRecipes = async (req, res, next) => {
    //#swagger.tags=['Recipes']
    const authorID = req.query.authorID;
    const searchStr = req.query.searchStr;
    const query = {};
        
    if (!!searchStr) {
        query.$or = [
            {title: {$regex: searchStr, $options: 'i'}},
            {description: {$regex: searchStr, $options: 'i'}},
            {cuisineType: {$regex: searchStr, $options: 'i'}},
            {mealType: {$regex: searchStr, $options: 'i'}},
            {keyWords: {$elemMatch: {$regex: searchStr, $options: 'i'}}}
        ]
    }
    if (!!authorID) query.authorID = authorID;

    const result = await mongodb.getDb().db('cse341-final_project').collection('recipes').find(query);
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getRecipe = async (req, res, next) => {
    //#swagger.tags=['Recipes']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('recipes').find({_id: id});
        if (!result) return res.status(404).json({ message: 'Recipe not found' });
        result.toArray().then((list) => {
            if (list.length === 0) return res.status(404).json({ message: 'User not found' });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addRecipe = async (req, res, next) => {
    //#swagger.tags=['Recipes']
    try {
        const newRecipe = {
            authorID: req.body.authorID,
            title: req.body.title,
            description: req.body.description,
            servings: req.body.servings,
            time: req.body.time,
            createdAt: new Date(),
            updatedAt: new Date(),
            cuisineType: req.body.cuisineType,
            mealType: req.body.mealType,
            keyWords: req.body.keyWords
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('recipes').insertOne(newRecipe);
        
        if (result.acknowledged) {
            console.log(`New Recipe created with the following id: ${result.insertedId}`);
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Recipe creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editRecipe = async (req, res, next) => {
    //#swagger.tags=['Recipes']
    try {
        const id = new ObjectId(req.params.id);
        const existingRecipe = await mongodb.getDb().db('cse341-final_project').collection('recipes').find({_id: id}).toArray();
        if (existingRecipe.length === 0) return res.status(404).json({ message: 'Recipe not found' });
        const Recipe = {
            title: req.body.title || existingRecipe.title,
            description: req.body.description || existingRecipe.description,
            servings: req.body.servings || existingRecipe.servings,
            time: req.body.time || existingRecipe.time,
            updatedAt: new Date(),
            cuisineType: req.body.cuisineType || existingRecipe.cuisineType,
            mealType: req.body.mealType || existingRecipe.mealType,
            keyWords: req.body.keyWords || existingRecipe.keyWords
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('recipes').replaceOne({_id: id}, Recipe);
    
        if (result.modifiedCount > 0) {
            console.log(`Recipe updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const deleteRecipe = async (req, res, next) => {
    //#swagger.tags=['Recipes']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('recipes').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`Recipe deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe };