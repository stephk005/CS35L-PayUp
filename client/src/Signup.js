import React, { useState } from "react";
import "./Login.css";
import "./Signup.css"
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

// TODO : validate emails
/*
function ValidateEmail(mail)
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}
*/

export default function Signup() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isValidSignUp, setIsValidSignUp] = useState(false);
  const navigate = useNavigate();

  const signup_errors = {
    email: "Email already in use. ",
    uname: "Username already in use. "
  };

  const handleSubmit = async (event) => {

    //Prevent page reload
    event.preventDefault();
    var { email, uname, pass} = document.forms[0];

    // Make get request to find user with specific username
    // console.log("email: ", email.value, " | uname: ", uname.value, " | pass: ", pass.value)
    const usernameResp = await fetch(`http://localhost:5050/record/user/username/${uname.value}`);
    const emailResp = await fetch(`http://localhost:5050/record/user/email/${email.value}`);

    // console.log('userrep, ', usernameResp);
    // console.log('emailrep, ', emailResp);

    if (!usernameResp.ok && usernameResp.statusText !== "Not Found"){
      const message = `An error has occured: ${usernameResp.statusText}`;
      window.alert(message);
      return;
    }

    if(!emailResp.ok && emailResp.statusText !== "Not Found"){
      const message = `An error has occurred: ${emailResp.statusText}`;
      window.alert(message);
      return;
    }

    // Compare user info
    console.log("emailresptext: ", emailResp.statusText);
    if (await emailResp.statusText !== "Not Found") {
      // Email already in use
      // console.log("email in use");
      setErrorMessages({ name: "err_email", message: signup_errors.email });
    }
    else if (await usernameResp.statusText !== "Not Found"){
      // Username already in use
      // console.log("username in use");
      setErrorMessages({ name: "err_name", message: signup_errors.uname });
    }else {
      setIsValidSignUp(true);

      // Need to make POST request to database

      const url = 'http://localhost:5050/record/user/create';

      // User Structure
      const newUser = {
        username: uname.value,
        password: pass.value,
        email: email.value,
        groups: [],
        friends: []
      };

      // POST request
      // await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newUser),
      // })
      // .catch(error => {
      //   window.alert(error);
      //   return;
      // });

      let result = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'   // This needs to be included for proper parsing
        },
        body: JSON.stringify(newUser)
    });

    console.log(result.statusText);

    if (result.status !== 201) console.log(await result.text());  // Logs errors
    else {
        let user = await result.json();  // Converts to proper JS Object
        console.log("user", user);
        let userData;
        try{
          const useridResp = await fetch(`http://localhost:5050/record/user/${user}`);
          userData = await useridResp.json();
          // console.log("userdata(resp),", userData);
        } catch (e) {
          console.error(e);
        }
        localStorage.setItem("currentuser", JSON.stringify(userData));
        // let currentUser = JSON.parse(localStorage.getItem("currentuser"));
        // console.log("user(signup) ", currentUser);
    }




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
          {/* {isValidSignUp ? <div>User is successfully signed up</div> : renderForm} */}
          {isValidSignUp ? navigate("/Home") : renderForm}
        </div>
      </div>
    </div>
  );
}
