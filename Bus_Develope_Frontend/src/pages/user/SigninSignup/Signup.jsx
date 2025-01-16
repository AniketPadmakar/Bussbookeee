import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StyleSignin from "./StyleSignin";
import axios from "axios";
import hostURL from "../../../data/URL";
import { setToken } from "../../../data/Token";

const Signup = () => {
  const [signup, setSignUp] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserSignUpData = (e) => {
    setSignUp({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(hostURL.link + "/api/user/signup", signup);

      console.log("Response from server:", response.data.token);
      const value = response.data.token;
      setToken(value);

      navigate("/user-dash");
    } catch (error) {
      console.error("Error making API call:", error);

      // Validate password
      if (signup.password.length < 8 || !/\d/.test(signup.password)) {
        alert("Password should be minimum 8 characters with at least 1 number");
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signup.email)) {
        alert("Invalid email address");
        return;
      }

      if (error.response && error.response.status === 409) {
        alert("Email is already registered. Please use a different email.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleSignin>
      <div className="Pt-body">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Signup</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Enter First Name"
                name="firstName"
                onChange={getUserSignUpData}
                required
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                onChange={getUserSignUpData}
                required
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Enter Email Address"
                name="email"
                onChange={getUserSignUpData}
                required
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={getUserSignUpData}
                required
              />
              <FaLock className="icon2" />
            </div>

            <button type="submit" className={loading ? "loading" : ""} disabled={loading}>
              {loading && <div className="spinner"></div>} {/* Render spinner if loading */}
              {!loading && "Submit"} {/* Render 'Submit' text if not loading */}
            </button>
          </form>
        </div>
      </div>
    </StyleSignin>
  );
};

export default Signup;
