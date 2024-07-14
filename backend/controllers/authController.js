import validator from "validator";
import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//Register
const registerController = async (req, res) => {

    try{
        const { name, emailId, password, confirmPassword, phoneNumber, address, answer } = req.body;

        // Fields are Empty
        if(!name || !emailId || !password || !confirmPassword || !phoneNumber || !address || !answer){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Check User Already Exist
        const existingUser = await userModel.findOne({emailId});
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already, Email Address is Registered',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isEmail(emailId)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Email',
            });
        }
        else if(!validator.isStrongPassword(password)){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }
        // Password and Confirm Password Match
        else if(password !== confirmPassword){
            return res.status(200).send({
                success: false,
                message: 'Password Not Mached',
            });
        }
        else if(!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, {min: 10, max: 10})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Indian Phone Number',
            });
        }
        else if(!validator.isAscii(address)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Address',
            });
        }
        else if(!validator.isNumeric(answer) || !validator.isLength(answer, {min: 4, max: 4})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid PIN',
            });
        }

        // Hash Generate
        const hashedPassword = await hashPassword(password);

        // Save
        const user = await new userModel({ name, emailId, password : hashedPassword, phoneNumber, address, answer });

        // Token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        user.tokens = user.tokens.concat({token: token});
        await user.save();

        // Cookie Store
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 604800),
            httpOnly:true //client can not change or remove 
            //secure: true //https only work
        });

        // Successfully Registered
        res.status(201).send({
            success: true,
            message: `Congratulations ${name}, You Successfully Registered`,
            user: {
                name: user.name,
                emailId: user.emailId,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role,
            },
            token
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Registration',
            error: error,
        });
    }

};

// Login
const loginController = async (req, res) => {

    try{
        const { emailId, password } = req.body;

        // Fields are Empty
        if(!emailId || !password){
            return res.status(200).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }

        if(!validator.isEmail(emailId)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Email',
            });
        }

        // Check User
        const user = await userModel.findOne({emailId});
        if(!user){
            return res.status(200).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }

        // Match Password
        const matchPassword = await comparePassword(password, user.password);
        if(!matchPassword){
            return res.status(200).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }

        // Token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        user.tokens = user.tokens.concat({token: token});
        await user.save();

        // Cookie Store
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 604800),
            httpOnly:true //client can not change or remove 
            //secure: true //https only work
        });

        // Successfully Login
        res.status(201).send({
            success: true,
            message: `${user.name}, Login Successful`,
            user: {
                name: user.name,
                emailId: user.emailId,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role,
            },
            token
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Login',
            error: error,
        });
    }

};

// Logout
const logoutController = async (req, res) => {

    try{
        const user = await userModel.findById(req.user._id);
        // Delete token from database
        user.tokens = user.tokens.filter((currElem) => {
            return (currElem.token != req.token);
        });

        // Delete token from cookie
        res.clearCookie("jwt");

        await user.save();
        res.status(200).send({
            success: true,
            message: 'Successfully Logout',
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Logout',
            error: error,
        });
    }

};

const forgotPasswordController = async (req, res) => {
    try{
        const { emailId, answer, newPassword } = req.body;

        // Fields are Empty
        if(!emailId || !answer || !newPassword){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Check Answer
        const user = await userModel.findOne({emailId, answer});
        if(!user){
            return res.status(200).send({
                success: false,
                message: 'Wrong Email or Answer',
            });
        }
        else if(!validator.isStrongPassword(newPassword)){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }

        // Hash Generate
        const hashedPassword = await hashPassword(newPassword);

        await userModel.findByIdAndUpdate(user._id, {password: hashedPassword});
        return res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Reset Password',
            error: error,
        });
    }
};

const updateProfileController = async (req, res) => {
    try{
        const {name, oldPassword, newPassword, phoneNumber, address} = req.body;
        const user = await userModel.findById(req.user._id);

        // Fields are Empty
        if(!name || !oldPassword || !phoneNumber || !address){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Match Password
        const matchPassword = await comparePassword(oldPassword, user.password);
        if(!matchPassword){
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isStrongPassword(newPassword) &&  newPassword){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }
        else if(!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, {min: 10, max: 10})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Indian Phone Number',
            });
        }
        else if(!validator.isAscii(address)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Address',
            });
        }

        // Hash Generate
        const hashedNewPassword = newPassword ? await hashPassword(newPassword) : undefined;

        const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedNewPassword || user.password,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address,
        }, {new: true});

        // Successfully Update
        res.status(201).send({
            success: true,
            message: `${updateUser.name}, Update Successful`,
            user: updateUser,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Updation',
            error: error,
        });
    }
};

const updateAdminProfileController = async (req, res) => {
    try{
        const {name, oldPassword, newPassword, phoneNumber, address} = req.body;
        const user = await userModel.findById(req.user._id);

        // Fields are Empty
        if(!name || !oldPassword || !phoneNumber || !address){
            return res.status(200).send({
                success: false,
                message: 'One or More Details are not Filled',
            });
        }

        // Match Password
        const matchPassword = await comparePassword(oldPassword, user.password);
        if(!matchPassword){
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        // Validations
        if(!validator.isAscii(name)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Name',
            });
        }
        else if(!validator.isStrongPassword(newPassword) &&  newPassword){
            return res.status(200).send({
                success: false,
                message: 'Make a Strong Password',
            });
        }
        else if(!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, {min: 10, max: 10})){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Indian Phone Number',
            });
        }
        else if(!validator.isAscii(address)){
            return res.status(200).send({
                success: false,
                message: 'Enter Valid Address',
            });
        }

        // Hash Generate
        const hashedNewPassword = newPassword ? await hashPassword(newPassword) : undefined;

        const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedNewPassword || user.password,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address,
        }, {new: true});

        // Successfully Update
        res.status(201).send({
            success: true,
            message: `${updateUser.name}, Update Successful`,
            user: updateUser,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error While Updation',
            error: error,
        });
    }
};

export { registerController, loginController, logoutController, forgotPasswordController, updateProfileController, updateAdminProfileController };