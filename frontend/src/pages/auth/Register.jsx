import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { toast } from 'react-toastify';
import Layout from "../../components/layouts/Layout";

const Register = () => {

    const [name, setName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    
    // Process Submitted Registration Details
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`http://localhost:8081/api/v1/auth/register`, {name, emailId, password, confirmPassword, phoneNumber, address, answer});

            if(res.data.success){
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                toast.success(res.data.message);
                navigate(location.state || "/");
            }
            else{
                toast.error(res.data.message);
            }
        }
        catch(error) {
            console.log(error);
            toast.error("Something Went Wrong.");
        }
    };

    return (
        <Layout title={'Register'}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h4>Register Page</h4>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="email" className="form-control" placeholder="Enter Your Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="Enter Your PhoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="Enter Your Address" value={address} onChange={(e) => setAddress(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="Enter 4 Digit PIN" value={answer} onChange={(e) => setAnswer(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </Layout>
    );
};

export default Register;