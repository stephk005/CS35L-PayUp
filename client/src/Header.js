import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";


export default function Header() {

    return (
        <div className="header">
            <div className="header_welcome">
            <Link className = "header_link" to="/">Welcome</Link>
            </div>
            <div className="header_login_link">
            <Link className = "header_link" to="/Login">Log in</Link>
            </div>
            <div className="header_signup_link">
            <Link className = "header_link" to="/Signup">Sign up</Link>
            </div>
        </div>
          
      );
}
