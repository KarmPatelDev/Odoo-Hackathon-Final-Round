import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes Token Base
const requireSignIn = async (req, res, next) => {

    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        if(!decode){
            req.ok = false;
        }
        else{
            req.user = decode;
            req.token = req.headers.authorization;
            req.ok = true;
        }
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

// Admin Access
const isAdmin = async (req, res, next) => {

    try{
        const user = await userModel.findById(req.user._id);
        (user.role !== 1) ? req.ok = false : req.ok = true;
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

// User Access
const isUser = async (req, res, next) => {

    try{
        const user = await userModel.findById(req.user._id);
        (user.role !== 0) ? req.ok = false : req.ok = true;
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong',
            error: error,
        });
    }

};

export { requireSignIn, isAdmin, isUser };