import React, { useState } from "react";
import "./Login.css";
import "./Signup.css"
import Header from "./Header";


export default function Signup() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isValidSignUp, setIsValidSignUp] = useState(false);

  const temp_database = [
    {
      useremail: "user1@gmail.com",
      username: "user1",
      password: "pass1"
    },
    {
      useremail: "user2@gmail.com",
      username: "user2",
      password: "pass2"
    }
  ];
  const signup_errors = {
    email: "Email already in use. ",
    uname: "Username already in use. "
    
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    console.log(document.forms[0])
    var { email, uname, pass} = document.forms[0];
    
    // Find user login info
    // console.log("1name: ", uname.value)
    // console.log("1email: ", email.value)
    const userEmailData = temp_database.find((user) => user.useremail == email.value);
    const userNameData = temp_database.find((user) => user.username == uname.value);
    // console.log("email: ", userEmailData)
    // console.log("name: ", userNameData)

    // Compare user info
      if (userEmailData) {
        // Email already in use
        console.log("fojefifis")
        setErrorMessages({ name: "err_email", message: signup_errors.email });
      } 
      else if (userNameData){
        // Username already in use
        setErrorMessages({ name: "err_name", message: signup_errors.uname });
      }else {
        setIsValidSignUp(true);
        /*store in database needs to be implemented */
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