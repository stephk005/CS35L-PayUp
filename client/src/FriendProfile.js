import "./FriendProfile.css";
import HomeHeader from "./HomeHeader";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useBeforeUnload, useCallback } from 'react-router-dom';


const Display = () =>{

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  let currentFriend = null

  const addData = async() =>{
    if (localStorage.getItem('currentfriend') !== null){
      currentFriend = localStorage.getItem('currentfriend')
    }
    const url = "http://localhost:5050/record/user/username/"+ localStorage.getItem('currentfriend')
    let result = await fetch(url);

    if(result.status == 200){
        let friendData = await result.json()
        setEmail(friendData["email"])
        setUsername(friendData["username"])
    }
    else 
      throw new Error("couldn't add data") 

  }
  addData()

  return (<div className="friendprofileinfo">
  <p>
    <span className="label">Username:</span>
    <span className="item">{username}</span>
  </p>
  <p>
    <span className="label">Email:</span>
    <span className="item">{email}</span>
  </p>
  </div>)


}



export default function FriendProfile() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    let currentFriend = null
    
    const handleFriendSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        setIsSubmitted(true);
        if (localStorage.getItem('currentfriend') === null && !isSubmitted) // if user is not saved in localstorage
        {
            const message = `An error has occured with remove friend:`;
            window.alert(message);
        }
        else {
          currentUser = JSON.parse(localStorage.getItem('currentuser'))
          const friendUrl = "http://localhost:5050/record/user/username/"+ localStorage.getItem('currentfriend')
          let friendResult = await fetch(friendUrl)
          let friendID_data = ""
          if(friendResult.status == 200){
            let friendData = await friendResult.json()
            friendID_data = friendData["_id"]
            const url = `http://localhost:5050/record/user/pop/friend/${currentUser._id}`; // Some user
            let friendID = ""
            if(friendID_data !== ""){
              friendID = {id: friendID_data};
            }
            let result = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'   // This needs to be included for proper parsing
                },
                body: JSON.stringify(friendID)
            });
            let friendArray = currentUser.friends
            friendArray.splice(friendArray.indexOf(friendID_data),1)
            currentUser["friends"] = friendArray
            localStorage.setItem("currentuser",JSON.stringify(currentUser))
            setIsSubmitted(true);

            if(result.status !== 201)
              throw new Error("couldnt request data")

          }
          else
            throw new Error("couldnt request data")
        }
      };

    const renderForm = (
      <div>
          <Display/>
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
