import HomeHeader from "./HomeHeader";
import  "./Profile.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function Profile() {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let email = currentUser.email;
    let username = currentUser.username;

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        console.log("signout user: ", localStorage.getItem('currentuser'));
        // console.log("b4 length: ", localStorage.length);

        if (localStorage.length <= 0) // if user is not saved in localstorage
        {
            const message = `An error has occured with sign out:`;
            window.alert(message);
        }
        else {
            localStorage.clear();
            setIsSubmitted(true);
            // console.log("aft length: ", localStorage.length);
        }

      };

    const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
                <div className="signout">
                  <a href="http://localhost:3000/Welcome">
                    <div className="button-container">
                      <input type="submit" value="Sign out" />
                    </div>
                  </a>
                </div>
          </form>
        </div>
      );

    return (
        <div>
            <HomeHeader/>
            <div className="profile">
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

                {isSubmitted ? navigate("/") : renderForm}
                {/* <Link className = "signout_link" to="/">Sign out</Link> */}

            </div>
      </div>
      );

}
