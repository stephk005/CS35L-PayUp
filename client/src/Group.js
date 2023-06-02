import React, { useState, useEffect } from "react";
import "./Group.css";
import HomeHeader from "./HomeHeader";
import CurrencyInput from 'react-currency-input-field';


export default function Group() {
  const [errorMessages, setErrorMessages] = useState({});
  const [groupList, setGroups] = useState([]);


  let currentUser = JSON.parse(localStorage.getItem('currentuser'));
  let groupIDs = currentUser.groups;


  // useEffect allows database calls to be async and to run before rendering happens
  useEffect(() => {

    parseTransactions();

    async function parseTransactions() {

      let tempGroups = [];

      for(let groupID of groupIDs){
        let groupURL = `http://localhost:5050/record/group/${groupID}`;
        
        let response = await fetch(groupURL);

        if(response.status !== 200)
          throw new Error("Invalid group ID in user!");

        let group = await response.json();

        // Now we need to get the lender, and all the borrowers + how much they borrowed
        let entry = {
          "name": group.name,
          "loanerName": null, // Should be another object, in the form {"name": amount}
          "loanAmount": null,
          "borrowerNames": null,  // Should be a list of objects, in the form [{"name": amount}]
          "borrowerAmounts": null
        };

        // Loop through transaction IDs and fill up the entry
        for(let transactionID of group.transactions){
          let transactionURL = `http://localhost:5050/record/transaction/${transactionID}`;

          let res = await fetch(transactionURL);

          if(res.status !== 200)
            throw new Error("Invalid transaction ID in group!");
          
          let transaction = await res.json();

          let loanerURL = `http://localhost:5050/record/user/${transaction.loaner}`;
          let borrowerURL = `http://localhost:5050/record/user/${transaction.borrower}`;
          let loaner = await fetch(loanerURL);
          let borrower = await fetch(borrowerURL);

          if(loaner.status !== 200 || borrower.status !== 200)
            throw new Error("Invalid user in transaction!");
          
          // Entry doesn't have a loaner/borrower yet
          if(!entry.loanerName){

            entry.loanerName = loaner.username;
            entry.loanAmount = transaction.amount;
            
            // Add first borrower + amount borrowed
            entry.borrowerNames = [borrower.username];
            entry.borrowerAmounts = [transaction.amount];

          } else { // Add more money to the amount loaned

            entry.loanAmount += transaction.amount;

            // Add another borrower + amount borrowed
            entry.borrowerNames.push(borrower.username);
            entry.borrowerAmounts.push(transaction.amount);
          }
        }

        // Finished filling the entry with transaction amounts, time to add it to groups
        tempGroups.push(JSON.parse(JSON.stringify(entry))); // Do this so object is passed by value
      }
      
      setGroups(tempGroups);
    }
    
  }, [groupIDs.length]);


  
  // List of group objects has been constructed, time to parse each

  let renderTransactions = (
    <div>
      {groupList.map((group, index) => {

        let loanerInfo = `${group.loanerName} paid $${group.loanAmount} dollars.`;
        let borrowerInfo = [];

        for(let i in group.borrowerNames)
          borrowerInfo.push(`${group.borrowerNames[i]} owes ${group.loanerName} $${group.borrowerAmounts[i]} dollars.`);

        // Render the transaction information
        return (
          <div className="transaction" key={index}>
            <div className="title">{group.name}</div>
            <div className="lender">{loanerInfo}</div>
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
  
  if(groupList.length === 0)
    renderTransactions = (
      <div className="transaction" key={0}>
        <div className="title">No groups to display</div>
      </div>
    );

  return (
  <div>
    <HomeHeader/>
    <div className="groupscreen">
      <div className="group">
        {renderTransactions}
        <a href="http://localhost:3000/Group/New">
          <button className="new-group-button">New Group</button>
        </a>
      </div>
    </div>
  </div>
  );
}