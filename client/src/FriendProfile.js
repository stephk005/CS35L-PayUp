import "./FriendProfile.css";
import HomeHeader from "./HomeHeader";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useBeforeUnload, useCallback } from 'react-router-dom';

export default function FriendProfile() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    // const [joinFlag, setJoinFlag] = useState(true);
    const navigate = useNavigate();
    let currentFriend = null
    console.log("FRIENDPROF TOP", localStorage);
    if (localStorage.getItem('currentfriend') !== null){
        currentFriend = JSON.parse(localStorage.getItem('currentfriend'));
    }
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isInitialRender, setInitialRender] = useState(true);
    // const isInitialRender = useRef(true);

    useEffect(() => {
        if (currentFriend !== null){
            setEmail(currentFriend.email);
            setUsername(currentFriend.username);
        }
        // runs this function when navigating away
        const handleBeforeUnload = () => {
          console.log("Running unload");
          localStorage.removeItem('currentfriend');
        };
      
        // // handles when page is unloaded
        // window.addEventListener("unload", handleBeforeUnload);
      
        // // cleanup function handles when navigating away
        // return () => {
        //   window.removeEventListener("unload", handleBeforeUnload);
        //     // if (!joinFlag){
        //   handleBeforeUnload();
        //     // }

        if (!isInitialRender) {
            return () => {
                window.removeEventListener("unload", handleBeforeUnload);
                handleBeforeUnload();
            };
            } else {
            // Mark the initial render as false
            setInitialRender(false);
            }
        // };
      }, []);
    
    const handleFriendSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        //console.log("remove friend: ", localStorage.getItem('currentfriend'));
        // console.log("b4 length: ", localStorage.length);
        setIsSubmitted(true);
        if (localStorage.getItem('currentfriend') === null && !isSubmitted) // if user is not saved in localstorage
        {
            const message = `An error has occured with remove friend:`;
            window.alert(message);
        }
        else {
            setEmail("");
            setUsername("");
            let currentUser = JSON.parse(localStorage.getItem('currentuser'));
            //console.log("USERID REMOVE FRIEND: ", currentUser._id);
            const url = `http://localhost:5050/record/user/pop/friend/${currentUser._id}`; // Some user
            //console.log("friend remove url: ", url);
            let friendID = {id: currentFriend._id};
            //console.log("friend remove id ", currentFriend._id);
            let result = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'   // This needs to be included for proper parsing
                },
                body: JSON.stringify(friendID)
            });
            //console.log(result.status);
            if(result.status !== 201) console.log("Error popping friend");
        }
      };

    const renderForm = (
      <div>
        <div className="friendprofileinfo">
                    <p>
                      <span className="label">Username:</span>
                      <span className="item">{username}</span>
                    </p>
                    <p>
                      <span className="label">Email:</span>
                      <span className="item">{email}</span>
                    </p>
                  </div>
          <div className="form">
            <form onSubmit={handleFriendSubmit}>
                  <div className="friendremove">
                    {/* <a href="http://localhost:3000/Welcome"> */}
                      <div className="button-container">
                        <input type="submit" value="Remove Friend" />
                      </div>
                    {/* </a> */}
                  </div>
            </form>
          </div>
        </div>
      );

    return (
        <div>
            <HomeHeader/>
            <div className="friendprofile">
                {isSubmitted ? navigate("/Home") : renderForm}
                {/* <Link className = "signout_link" to="/">Sign out</Link> */}
            </div>
      </div>
      );

}
