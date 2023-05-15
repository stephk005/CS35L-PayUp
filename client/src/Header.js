import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";


export default function Header() {

    return (
        <div className="header">
            <div className="home">
            <Link className = "link" to="/">Home</Link>
            </div>
            <div className="login_link">
            <Link className = "link" to="/Login">Log in</Link>
            </div>
            <div className="signup_link">
            <Link className = "link" to="/Signup">Sign up</Link>
            </div>
        </div>
          
      );
}
