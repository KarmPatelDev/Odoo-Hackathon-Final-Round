import validator from "validator";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

const createCategoryController = async (req, res) => {

    try{
        const { name } = req.body;

        // Fields are Empty
        if(!name){
            return res.status(200).send({
                success: false,
                message: 'Category is not Filled',
            });
        }

        // Check Category Already Exist
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: 'Already, Category is Exist',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Category',
            });
        }

        // Save
        const category = await new categoryModel({ name, slug: slugify(name) }).save();

        // Successfully Created Category
        res.status(201).send({
            success: true,
            message: `Successfully ${name} category created`,
            category: category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Category',
            error: error,
        });
    }

};

const updateCategoryController = async (req, res) => {

    try{
        const { name } = req.body;
        const { id } = req.params;

        // Fields are Empty
        if(!name){
            return res.status(200).send({
                success: false,
                message: 'Category is not Filled',
            });
        }

        // Check Category Already Exist
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: 'Already, Category is Exist',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Category',
            });
        }

        // Update
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true});
        
        // Successfully Updated Category
        res.status(201).send({
            success: true,
            message: `Successfully category updated to ${name}`,
            category: category,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Category',
            error: error,
        });
    }

};

const deleteCategoryController = async (req, res) => {

    try{
        const { id } = req.params;

        // Delete
        const category = await categoryModel.findByIdAndDelete(id);
        
        // Successfully Deleted Category
        res.status(201).send({
            success: true,
            message: `Successfully category deleted`,
            category: category,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Category',
            error: error,
        });
    }

};

const getCategoryController = async (req, res) => {

    try{
        const { slug } = req.params;

        const category = await categoryModel.findOne({slug});

        // Successfully Got Category
        res.status(201).send({
            success: true,
            message: `Successfully got category`,
            category: category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Category',
            error: error,
        });
    }

};

const getCategoriesController = async (req, res) => {

    try{
        const categories = await categoryModel.find({});

        // Successfully Got Categories
        res.status(201).send({
            success: true,
            message: `Successfully got categories`,
            categories: categories,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Categories',
            error: error,
        });
    }
    
};

export { createCategoryController, updateCategoryController, deleteCategoryController, getCategoryController, getCategoriesController };