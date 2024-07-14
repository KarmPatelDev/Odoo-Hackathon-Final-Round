import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { toast } from 'react-toastify';
import Layout from "../../components/layouts/Layout";

const Login = () => {

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    // Process Submitted Login Details
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`http://localhost:8081/api/v1/auth/login`, {emailId, password});
            
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
        <Layout title={'Login'}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h4>Login Page</h4>
                <div className="form-group my-2">
                    <input type="email" className="form-control" placeholder="Enter Your Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="mt-3">
                    <button type="button" className="btn btn-primary" onClick={() => navigate("/forgot-password")}>Forgot Password</button>
                </div>
                
                </form>
            </div>
        </Layout>
    );
};

export default Login;