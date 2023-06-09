import React, { useState, useEffect, useRef } from "react";
import "./HomeHeader.css";
import { Link } from "react-router-dom";


export default function HomeHeader() {
    return (
        <div className="homeheader">
            <div className="homeheader_welcome">
                <Link className = "homeheader_link" to="/Home">Home</Link>
            </div>
            <div className="homeheader_tempgroup_link">
                <Link className = "homeheader_link" to="/Group">View Groups</Link>
            </div>
            <div className="homeheader_newgroup_link">
                <Link className = "homeheader_link" to="/Group/New">Create Group</Link>
            </div>
            <div className="homeheader_profile_link">
                <Link className = "homeheader_link" to="/Profile">Profile</Link>
            </div>
        </div>
          
    );
}

