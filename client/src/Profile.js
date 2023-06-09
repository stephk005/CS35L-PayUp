import HomeHeader from "./HomeHeader";
import  "./Profile.css";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function Profile() {

    const [isSubmitted, setIsSubmitted] = useState(false);
    let validated = useRef(true);
    const navigate = useNavigate();


    useEffect(() => {
      if(!sessionStorage.getItem("currentuser")){
        console.log("Profile found no user in local storage!");
        window.alert("Cannot access Profile if not signed in");
        navigate("/", {replace: true});
        validated.current = false;
      }
    }, [navigate]);


    let currentUser = JSON.parse(sessionStorage.getItem('currentuser'));
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");


    useEffect(() => {
      if(validated.current){
        setEmail(currentUser.email);
        setUsername(currentUser.username);
      }
    }, []);


    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        console.log("signout user: ", sessionStorage.getItem('currentuser'));

        if (sessionStorage.length <= 0) // if user is not saved in sessionStorage
        {
            const message = `An error has occured with sign out:`;
            window.alert(message);
        }
        else { // handle sign out
            setEmail("");
            setUsername("");
            sessionStorage.clear();
            setIsSubmitted(true);
        }

      };

    const renderForm = (
      <div>
        <div className="profileinfo">
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
            <form onSubmit={handleSubmit}>
                  <div className="signout">
                    <div className="button-container">
                      <input type="submit" value="Sign out" />
                    </div>
                  </div>
            </form>
          </div>
        </div>
      );

    if(!validated.current)
      return null;
    
    return (
        <div>
            <HomeHeader/>
            <div className="profile">
                {isSubmitted ? navigate("/") : renderForm}
            </div>
      </div>
      );

}
