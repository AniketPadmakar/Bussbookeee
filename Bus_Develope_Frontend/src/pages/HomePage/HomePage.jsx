import React from 'react';
import { Link } from 'react-router-dom';
import StyleHomepage from './StyleHomepage';

const Home = () => {
  return (
    <StyleHomepage>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', sans-serif;
          background: #f4f4f9;
          color: #333;
        }

        .hm-body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 0 20px;
        }

        .home-container {
          text-align: center;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 800px;
          transition: transform 0.3s ease-in-out;
        }

        /* Heading styles */
        .main-heading {
          font-size: 2.5rem;
          color: #0066cc;
          margin-bottom: 20px;
          animation: fadeIn 2s ease-out;
        }

        .sub-heading {
          font-size: 1.5rem;
          color: #555;
          margin-bottom: 40px;
          animation: fadeIn 2s ease-out 0.5s;
        }

        .module-container {
          display: flex;
          justify-content: space-around;
          gap: 20px;
          margin-top: 30px;
          animation: fadeIn 2s ease-out 1s;
        }

        .module {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          width: 200px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
        }

        .module:hover {
          transform: translateY(-10px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }

        .module h3 {
          color: #333;
          font-size: 1.25rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .link-btn {
          display: block;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          margin-top: 10px;
          margin-right: 10px;
          font-size: 1rem;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        /* Added margin-bottom for space between buttons */
        .link-btn:not(:last-child) {
          margin-bottom: 15px;
        }

        .link-btn:hover {
          background-color: #004a99;
          transform: translateY(-5px);
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className='hm-body'>
        <div className="home-container">
          <h1 className="main-heading">Welcome to Bus Booking</h1>
          <center><h2 className="sub-heading">Home Page</h2></center>
          <div className="module-container">
            <div className="module">
              <h3>User</h3>
              <Link className="link-btn" to="/user-signin">Signin</Link>
              <Link className="link-btn" to="/user-signup">Signup</Link>
            </div>
            <div className="module">
              <h3>Admin</h3>
              <Link className="link-btn" to="/admin-signin">Signin</Link>
              <Link className="link-btn" to="/admin-signup">Signup</Link>
            </div>
          </div>
        </div>
      </div>
    </StyleHomepage>
  );
}

export default Home;
