import React, { useEffect, useRef, useState } from "react";
import "./Group.css";
import HomeHeader from "./HomeHeader";
import CurrencyInput from 'react-currency-input-field';


export default function Group() {
  const [rerender, setRerender] = useState(true);
  let groupList = useRef([]);
  let isFetching = useRef(true);


  useEffect(() => {

    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let groupIDs = currentUser.groups;
    
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
          "borrowerAmounts": null,
          "isPaid": {}
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

          
          loaner = await loaner.json();
          borrower = await borrower.json();
          
          // Entry doesn't have a loaner/borrower yet
          if(!entry.loanerName){

            entry.loanerName = loaner.username;
            entry.loanAmount = transaction.totalAmountPaid
            
            // Add first borrower + amount borrowed
            entry.borrowerNames = [borrower.username];
            entry.borrowerAmounts = [transaction.amount];
            entry.isPaid[borrower.username] = transaction.isPaid

          } else { // Add more money to the amount loaned

            entry.loanAmount += transaction.totalAmountPaid

            // Add another borrower + amount borrowed
            entry.borrowerNames.push(borrower.username);
            entry.borrowerAmounts.push(transaction.amount);
          }
        }

        // Finished filling the entry with transaction amounts, time to add it to groups
        tempGroups.push(JSON.parse(JSON.stringify(entry))); // Do this so object is passed by value
      }
      
      if(isFetching.current)
        setRerender(!rerender);

      groupList.current = tempGroups;
      isFetching.current = false;

    }
    
  }, [rerender]);

  
  // List of group objects has been constructed, time to parse each

  let renderTransactions;
  
  if(isFetching.current)
    renderTransactions = null;  // Don't render anything while loading
  else if(groupList.current.length === 0) 
    renderTransactions = (
      <div className="transaction" key={0}>
        <div className="title">No groups to display</div>
      </div>
    );  // Render a disclaimer, no groups
  else
    renderTransactions = (
      <div>
        {groupList.current.map((group, index) => {

          let loanerInfo = `${group.loanerName} paid $${group.loanAmount} dollars.`;
          let borrowerInfo = [];

          for(let i in group.borrowerNames){

            let temp =`${group.borrowerNames[i]} owes ${group.loanerName} $${group.borrowerAmounts[i]} dollars`
            if (group.isPaid[group.borrowerNames[i]]){
              borrowerInfo.push(temp+": PAID")
            }
            else{
              borrowerInfo.push(temp)
            }
          }

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
    ); // Render the list of transactions as 1 group


  return (
  <div>
    <HomeHeader/>
    <div className="groupscreen">
      <div className="group">
      <a href="http://localhost:3000/Group/New">
          <button className="new-group-button">New Group</button>
        </a>
        {renderTransactions}
      </div>
    </div>
  </div>
  );
}