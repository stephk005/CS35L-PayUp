import React, { useState } from "react";
import "./Login.css";
import "./Signup.css"
import Header from "./Header";


export default function Signup() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isValidSignUp, setIsValidSignUp] = useState(false);

  const signup_errors = {
    email: "Email already in use. ",
    uname: "Username already in use. "
  };

  const handleSubmit = async (event) => {
    
    //Prevent page reload
    event.preventDefault();
    var { email, uname, pass} = document.forms[0];

    // Make get request to find user with specific username
    const usernameResp = await fetch(`http://localhost:5050/record/user/username/${uname.value}`);
    const emailResp = await fetch(`http://localhost:5050/record/user/email/${email.value}`);

    if (!usernameResp.ok){
      const message = `An error has occured: ${usernameResp.statusText}`;
      window.alert(message);
      return;
    }

    if(!emailResp.ok){
      const message = `An error has occurred: ${emailResp.statusText}`;
      window.alert(message);
      return;
    }

    // Compare user info
    if (await emailResp.text() !== "Not found") {
      // Email already in use
      console.log("fojefifis")
      setErrorMessages({ name: "err_email", message: signup_errors.email });
    } 
    else if (await usernameResp.text() !== "Not found"){
      // Username already in use
      setErrorMessages({ name: "err_name", message: signup_errors.uname });
    }else {
      setIsValidSignUp(true);

      // Need to make POST request to database

      // User Structure
      const newUser = {
        username: uname.value,
        password: pass.value,
        email: email.value
      };

      // POST request
      await fetch("http://localhost:5050/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
      .catch(error => {
        window.alert(error);
        return;
      });
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
          <label>Email Address </label>
          <input type="text" name="email" required />
          {renderErrorMessage("err_email")}
        </div>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("err_name")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
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
          <div className="title">Sign Up</div>
          {isValidSignUp ? <div>User is successfully signed up</div> : renderForm}
        </div>
      </div>
    </div>
  );
}