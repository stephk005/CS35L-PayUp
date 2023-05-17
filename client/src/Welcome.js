import React, { useState } from "react";
import "./Welcome.css";
import {Link} from "react-router-dom"
import Header from "./Header";

export default function Welcome() {
    return (
      <div>
        <Header/>
        <div className="welcome">
          <div className="intro">
                <p>Paragraph about payup and other introduction stuff. </p>
          </div>
        </div>
      </div>

      );
}
