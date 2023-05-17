import HomeHeader from "./HomeHeader";
import  "./Profile.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
    return (
        <div>
            <HomeHeader/>
            <div className="profile">
                <div className="profileinfo">
                    <p>Profile stuff here. </p>
                </div>
                <div className="signout">
                <Link className = "signout_link" to="/">Sign out</Link>
                </div>
            </div>
      </div>
      );

}