import HomeHeader from "./HomeHeader";
import  "./Profile.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function Profile() {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
      setEmail(currentUser.email);
      setUsername(currentUser.username);
    }, []);

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        console.log("signout user: ", localStorage.getItem('currentuser'));

        if (localStorage.length <= 0) // if user is not saved in localstorage
        {
            const message = `An error has occured with sign out:`;
            window.alert(message);
        }
        else { // handle sign out
            setEmail("");
            setUsername("");
            localStorage.clear();
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

    return (
        <div>
            <HomeHeader/>
            <div className="profile">
                {isSubmitted ? navigate("/") : renderForm}
            </div>
      </div>
      );

}
