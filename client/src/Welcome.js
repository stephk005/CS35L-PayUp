import React, { useEffect } from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import logoImage from "./logo.png";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    if(sessionStorage.getItem("currentuser")){
      console.log("Welcome found user in local storage!");
      window.alert("Cannot access Welcome if you've signed in");
      navigate("/Home", {replace: true});
    }
  }, [navigate]);

  return (
    <div>
      <Header/>
      <div className="welcome">
        <div className="text-container">
          <h1 className="intro">PayUp</h1>
          <h2 className="slogan">Expenses made easy.</h2>
          <h2 className="slogan">Sign up today.</h2>
          </div>
      <img src={logoImage} className="logo" />
      </div>
    </div>
  );
}
