import React, { useEffect, useState } from "react";
import "./Login.css";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const login_errors = {
    uname: "Invalid username",
    pass: "Invalid password"
  };


  useEffect(() => {
    if(sessionStorage.getItem("currentuser")){
      console.log("Login found user in local storage!");
      window.alert("Cannot access Login if you've signed in");
      navigate("/Home", {replace: true});
    }
  }, [navigate]);


  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    var { uname, pass } = document.forms[0];

    // Find user login info
    const usernameResp = await fetch(`http://localhost:5050/record/user/username/${uname.value}`);

    if (usernameResp.statusText !== "Not Found" && !usernameResp.ok){
      const message = `An error has occured: ${usernameResp.statusText}`;
      window.alert(message);
      return;
    }

    let userData;
    try{
      userData = await usernameResp.json();
      // console.log(userData);
    } catch (e) {
      console.error(e);
    }

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "err_pass", message: login_errors.pass });
      } else {
        setIsSubmitted(true);
        sessionStorage.setItem("currentuser", JSON.stringify(userData));
        // let currentUser = JSON.parse(sessionStorage.getItem("currentuser"));
        // console.log("user(login) ", currentUser);

      }
    } else {
      // Username not found
      setErrorMessages({ name: "err_name", message: login_errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("err_name")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("err_pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <Header/>
      <div className="login">
        <div className="login-form">
          <div className="title">Sign In</div>
          {/* {isSubmitted ? <div>User is successfully logged in</div> : renderForm} */}
          {isSubmitted ? navigate("/Home") : renderForm}
        </div>
      </div>
    </div>
  );
}