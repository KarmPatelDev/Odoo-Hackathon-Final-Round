import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import Layout from "../../components/layouts/Layout";

const ForgotPassword = () => {

    const [emailId, setEmailId] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    // Process Submitted Login Details
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post(`http://localhost:8081/api/v1/auth/forgot-password`, {emailId, answer, newPassword});
            
            if(res.data.success){  
                toast.success(res.data.message);
                navigate("/login");
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
        <Layout title={'Forgot Password'}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h4>Reset Password</h4>
                <div className="form-group my-2">
                    <input type="email" className="form-control" placeholder="Enter Your Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="Enter 4 Digit PIN" value={answer} onChange={(e) => setAnswer(e.target.value)} required/>
                </div>
                <div className="form-group my-2">
                    <input type="password" className="form-control" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button> 
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;