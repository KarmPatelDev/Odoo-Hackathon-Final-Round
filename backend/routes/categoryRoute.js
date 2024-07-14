import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, updateCategoryController, getCategoryController, getCategoriesController } from "../controllers/categoryController.js";

// Router Object
const router = express.Router();

// Routing

// Create Category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// Update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// Delete Category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

// Get Category
router.get('/get-category/:slug', getCategoryController);

// Get Categories
router.get('/get-categories', getCategoriesController);

export default router;