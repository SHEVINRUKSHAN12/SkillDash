import React from "react";
import './login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo"> 
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/explore">Explore</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </nav>
      </div>

      <div className="login-content">
        <div className="left-panel">
          <h2>Hello, Welcome!</h2>
          <p>Don’t Have an Account?</p>
          <button className="register-btn">Register</button>
        </div>
        
        <div className="right-panel">
          <div className="toggle-buttons">
            <button className="active">Job Seeker</button>
            <button>Recruiter</button>
          </div>

          <h2>Login</h2>

          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <p className="forgot-password">Forget Password?</p>

          <button className="login-btn">Login</button>

          <p className="social-text">Or login with social platforms</p>

          <div className="social-icons">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-google"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-github"></i>
            <i className="fab fa-linkedin"></i>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <p>pissuwk</p>
      </footer>
    </div>
  );
};

export default Login;
