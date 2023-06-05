import React, { useState } from "react";
import "./HomeHeader.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function HomeHeader() {
    const navigate = useNavigate(); 
    const handleClick = async (event) => {
        event.preventDefault();
        console.log("CLICK BALANCE", localStorage);
        let currentUser = JSON.parse(localStorage.getItem('currentuser')) 
        let friends = currentUser.friends; //grab list of friends given user
        // console.log("friend id", friends[0]);
        let friend = friends[0]; // temp friend -> first friend on friends list
        const friendidResp = await fetch(`http://localhost:5050/record/user/${friend}`);

        //fetch friend data 
        if (friendidResp.statusText !== "Not Found" && !friendidResp.ok){
            const message = `An error has occured: ${friendidResp.statusText}`;
            window.alert(message);
            return;
        }
        let friendData;
        try{
        friendData = await friendidResp.json();
        // console.log("friend data: ", friendData);
        localStorage.setItem("currentfriend", JSON.stringify(friendData));
        console.log("CLICK BALANCE BOT ", localStorage);
        navigate("/FriendProfile")
        } catch (e) {
        console.error(e);
        }
    };
    return (
        <div className="homeheader">
            <div className="homeheader_welcome">
            <Link className = "homeheader_link" to="/Home">Home</Link>
            </div>
            <div className="homeheader_balance">
            {/* <Link className = "homeheader_link" to="/FriendProfile" onClick={() => handleClick()} >Balance</Link> */}
            <label onClick={handleClick}>Balance</label>
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

