import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import StyleSignin from './StyleSignin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import hostURL from '../../../data/URL'
import { setToken } from "../../../data/Token";

const Signin = () => {
    const [login, setLogIn] = useState({});
    const [loading, setLoading] = useState(false); // State to manage loading status
    const navigate = useNavigate();

    const getUserLogInData = (e) => {
        setLogIn({ ...login, [e.target.name]: e.target.value });
    };

    const handleLogInSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading animation

        try {
            const response = await axios.post(hostURL.link + '/api/admin/signin', login);
            console.log('Response from server:', response.data.token);
            const value = response.data.token;
            setToken(value);

            console.log("Successfully Logged INnn");

            // Redirect to the patient dashboard page
            navigate('/admin-dash');
        } catch (error) {
            console.error('Error making API call:', error);

            if (error.response && error.response.status === 401) {
                alert('Invalid Credentials');
            } else {
                alert('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false); // Stop loading animation regardless of success or failure
        }
    };

    return (
        <StyleSignin>
            <div className="Pt-body">
                <div className="wrapper">
                    <form onSubmit={handleLogInSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" name="email" placeholder="Email" onChange={getUserLogInData} required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" name="password" placeholder="Password" onChange={getUserLogInData} required />
                            <FaLock className="icon2" />
                        </div>

                        <button type="submit" className={loading ? 'loading' : ''} disabled={loading}>
                            {loading && <div className="spinner"></div>} {/* Render spinner if loading */}
                            {!loading && 'Login'} {/* Render 'Login' text if not loading */}
                        </button>
                    </form>
                </div>
            </div>
        </StyleSignin>
    );
}

export default Signin;
