import React, { useState } from "react";
import "./Group.css";
import HomeHeader from "./HomeHeader";
import CurrencyInput from 'react-currency-input-field'; 


export default function Group() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [friend, setFriend] = useState("friend1");

  //temp list of friends 
  const friends = [
    {
      label: "Friend 1",
      value: "friend1",
    },
    {
      label: "Friend 2",
      value: "friend2",
    },
    {
      label: "Friend 3",
      value: "friend3",
    },
    {
      label: "Friend 4",
      value: "friend4",
    },
  ];

  const groupname = "San Diego Trip";
  const temp_database = [
    {
      "Dinner": {
        lender: { "Ian": 50 },
        borrower: {
          "Steph": 20,
          "Cris": 10,
          "Henry": 20
        }
      }
    },
    {
      "Uber": {
        lender: { "Henry": 30 },
        borrower: {
          "Steph": 10,
          "Cris": 10
        }
      }
    }
  ];

  const renderTransactions = (
    <div>
      {temp_database.map((entry) => {
        const key = Object.keys(entry)[0]; // Get the key of the entry
        const transaction = entry[key]; // Get the transaction object
        const lender = Object.keys(transaction.lender)[0];

        // Format and render the lender information
        const lenderInfo = Object.entries(transaction.lender)
          .map(([name, amount]) => `${name} paid $${amount}.`)
          .join(' ');

        // Format and render the borrower information as an array
        const borrowerInfo = Object.entries(transaction.borrower).map(
          ([name, amount]) => `${name} owes ${lender} $${amount}.`
        );

        // Render the transaction information
        return (
          <div className="transaction" key={key}>
            <div className="title">{key}</div>
            <div className="lender">{lenderInfo}</div>
            <div className="borrower">
              {borrowerInfo.map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // const handleChange = (event) => {
  //   setState({selectValue: event.target.value}, ()=> {alert(`Value: ${state.selectValue}`)});
  //   } 

  const renderDropdown = (
    <div>
      <label>Select Friend: </label>
      <select value={friend} onChange={e=>setFriend(e.target.value)}>
      {/*   <option value="friend1" >Friend 1</option>
        <option value="friend2">Friend 2</option>
        <option value="friend3">Friend 3</option>
        <option value="friend4">Friend 4</option> */}
        {friends.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
      </select>

    </div>
  );

  const handleSubmit = async (event) => {
    
    //Prevent page reload
    event.preventDefault();
    var { transname,amount} = document.forms[0];
    // var { transname, friend, amount} = document.forms[0];
    // console.log(document.forms[0]);
    // console.log("name: ", transname.value);
    // console.log("amount: ", amount.value);
    // console.log("friend: ", friend);
  }


// Creating new transaction entry
  const renderEntryForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="entry">
            <label className="entrylabel">Create entry</label>
            <div className="input-container">
              <label>Enter Transaction Name: </label>
              <input type="text" name="transname" required />
            </div>
            <div className="dropdown">{renderDropdown}</div>
            <div className="input-container">
              <label>Amount Requested ($): </label>
              <CurrencyInput name="amount" allowNegativeValue={false} 
              disableAbbreviations={true} disableGroupSeparators={true} />
            </div>
            <div className="button-container">
             <input type="submit" />
           </div>
        </div>
      </form>
    </div>
  );

  
  return (
  <div>
    <HomeHeader/>
    <div className="groupscreen">
      <div className="group">
        <div className="title">{groupname}</div>
        {renderTransactions}
        <a href="http://localhost:3000/Group/New">
          <button className="new-group-button">New Group</button>
        </a>
      </div>
        {renderEntryForm}
    </div>
  </div>
  );
}
