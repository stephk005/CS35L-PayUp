import React, { useState } from "react";
import "./HomeHeader.css";
import { Link } from "react-router-dom";


export default function HomeHeader() {

    return (
        <div className="homeheader">
            <div className="homeheader_welcome">
            <Link className = "homeheader_link" to="/Home">Home</Link>
            </div>
            <div className="homeheader_balance">
            {/* <Link className = "homeheader_link" to="/Profile">Balance</Link> */}
            <label>Balance</label>
            </div>
            <div className="homeheader_tempgroup_link">
            <Link className = "homeheader_link" to="/Group">TempGroup</Link>
            </div>
            <div className="homeheader_profile_link">
            <Link className = "homeheader_link" to="/Profile">Profile</Link>
            </div>
        </div>
          
      );
}

