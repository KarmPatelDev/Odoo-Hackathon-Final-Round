import express from "express";
import { loginController, registerController, logoutController, forgotPasswordController, updateProfileController, updateAdminProfileController } from "../controllers/authController.js";
import { requireSignIn, isAdmin, isUser } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router();

// Routing

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Logout
router.get("/logout", requireSignIn, logoutController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Update Profile
router.put("/update-profile", requireSignIn, updateProfileController);

// Update Admin Profile
router.put("/update-admin-profile", requireSignIn, isAdmin, updateAdminProfileController);

// Dashboard
router.get("/user-auth", requireSignIn, isUser, (req, res) => {
    res.status(200).send({ok: req.ok});
});

// Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: req.ok});
});

export default router;