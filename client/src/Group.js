import React, { useState } from "react";
import "./Group.css";
import Header from "./Header";

export default function Group() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  return (
  <div>
    <Header/>
    <div className="group">
      <div className="title">{groupname}</div>
      {renderTransactions};
    </div>
  </div>
  );
}
