import React, { useState } from "react";
import "./Group.css";
import Header from "./Header";

export default function Group() {
  const groupname = "San Diego Trip";
  const yourTransactions = [-10, -5, 8];

  return (
    <div>
      <Header/>
      <center>
        <div className="title">{groupname}</div>
        <label>Transactions </label>
      </center>
    </div>
  );
}
