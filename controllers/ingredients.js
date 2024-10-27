const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getIngredients = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').find();
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getIngredientsByRecipe = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').find();
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getIngredient = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').find({_id: id});
        if (!result) return res.status(404).json({ message: 'Ingredient not found' });
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addIngredient = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    try {
        const newIngredient = {
            name: req.body.name,
            quantity: req.body.quantity,
            unit: req.body.unit,
            recipeID: req.body.recipeID
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').insertOne(newIngredient);
        
        if (result.acknowledged) {
            console.log(`New Ingredient created with the following id: ${result.insertedId}`);
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Ingredient creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editIngredient = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    try {
        const id = new ObjectId(req.params.id);
        const existingIngredient = await mongodb.getDb().db('cse341-final_project').collection('ingredients').find({_id: id}).toArray();
        if (existingIngredient.length === 0) return res.status(404).json({ message: 'Ingredient not found' });
        const Ingredient = {
            name: req.body.name || existingIngredient.name,
            quantity: req.body.quantity || existingIngredient.quantity,
            unit: req.body.unit || existingIngredient.unit
        };
        const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').replaceOne({_id: id}, Ingredient);
        if (result.modifiedCount > 0) {
            console.log(`Ingredient updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const deleteIngredient = async (req, res, next) => {
    //#swagger.tags=['Ingredients']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-final_project').collection('ingredients').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`Ingredient deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports = { getIngredients, getIngredientsByRecipe, getIngredient, addIngredient, editIngredient, deleteIngredient };