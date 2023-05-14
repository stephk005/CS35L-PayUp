import React, { useState } from "react";
import "./NewGroup.css";
import Header from "./Header";

export default function NewGroup() {
  const [members, setMembers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const button = document.getElementById('add-friends-button');
  const dropdown = document.getElementById('add-friends-dropdown');

  const addMember = (name) => {
    setMembers([...members, name]);
  };

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Amount entered: ", amount);
    setIsSubmitted(true);
  };

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Group Name </label>
          <input type="text" name="groupname" required />
          {/* renderErrorMessage("err_email") */}
        </div>
        <div className="input-container">
          <label>You paid </label>
          <input type="number" name="paid" required />
          {/* renderErrorMessage("err_name") */}
        </div>
        <button class="add-friends-button">Add Friends</button>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );


  return (
    <div>
      <Header/>
      <div className="newgroup">
        <div className="newgroup-form">
          {isSubmitted ? <div>Group successfully created</div> : renderForm}
        </div>
      </div>
    </div>
  );
}
