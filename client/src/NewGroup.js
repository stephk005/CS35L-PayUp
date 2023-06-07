import React, { useState, useEffect, useRef } from "react";
import "./NewGroup.css";
import HomeHeader from "./HomeHeader";
import CurrencyInput from 'react-currency-input-field';


  

const DropdownMenu = ({ selectedFriends, handleFriendSelection, setData, errorMessages}) => {
  const dropdownRef = useRef(null);
  const [amounts, setAmounts] = useState({});
  const [rerender, setRerender] = useState(true);
  let isFetching = useRef(true);
  let friends = useRef([]);

  // const [errorMessages, setErrorMessages] = useState({});

  console.log("ERROR MESSAGES: ", errorMessages.message);
  
  const friend_errors = {
    amount: "Must enter an amount",
    friend: "Must choose a friend", 
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );
    
  const setAmountsDictionary = (amount,friend) =>{
    const newAmounts = { ...amounts, [friend]: amount};
    setAmounts(newAmounts);
  }
  const handleDropdownToggle = () => {
    dropdownRef.current.classList.toggle("is-active");
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };


  useEffect(() => {

    const closeDropdown = (e) => {
      if (!dropdownRef.current.contains(e.target))
        dropdownRef.current.classList.remove("is-active");
    };

    document.addEventListener("click", closeDropdown);

    return () => { document.removeEventListener("click", closeDropdown); };
  }, []);



  useEffect(() => {

    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    let friendIDs = currentUser.friends;

    loadFriendList();

    async function loadFriendList() {
      
      let friendArray = [];

      //console.log(await result.json()); 
      for (const friendID of friendIDs){
          //console.log(friendID)

          const url = "http://localhost:5050/record/user/"+ friendID;
          let result = await fetch(url);
          if(result.status === 200){ 
            //console.log(await result2.json()); 
            const friendData = await result.json();
            const tempData = {name: friendData["username"], amount: 0};
            friendArray.push(tempData);
          }
          else console.log("Error sending request");
      }
      
      friends.current = friendArray;

      if(isFetching.current)
        setRerender(!rerender);

      isFetching.current = false;
    }
  }, [rerender]);
  

  return (

    <div className="dropdown-container">
      <div>
        {setData(amounts)}
      </div>
      <div className="dropdown-menu checkbox-dropdown" ref={dropdownRef} onClick={handleDropdownToggle}>
        <h4>Select friends:</h4>
        <ul className="checkbox-dropdown-list" onClick={handleDropdownClick}>
          {
            friends.current.map((friend) => (
            <li key={friend.name}>
              <label>
                <input
                  type="checkbox"
                  value={friend.name}
                  checked={selectedFriends.includes(friend.name)}
                  onChange={handleFriendSelection}
                />
                {friend.name}
              </label>
            </li>
          ))}
        </ul>
        {renderErrorMessage("err_friend")}
        {selectedFriends.length > 0 && (
          <div className="selected-friends">
            <h4>Selected Friends:</h4>
            {selectedFriends.map((friend) => (
              <div key={friend}>
                {/* {friend}: <input type="number" value={amounts[friend]} onChange={(event) => handleAmountChange(event, friend)} /> */}
                {friend} will pay ($): <CurrencyInput name="pay" onValueChange={(theAmount,theName)=>{setAmountsDictionary(theAmount,friend)}} value={amounts[friend]} allowNegativeValue={false}  disableAbbreviations={true} disableGroupSeparators={true} required/>
                {renderErrorMessage("err_friendamount")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



export default function NewGroup() {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Amount, setAmount] = useState(0)
  const [Name, setName] = useState("")
  const [errorMessages, setErrorMessages] = useState({});

  const submit_errors = {
    groupname: "Must enter group name",
    amount: "Must enter an amount",
    friend: "Must choose a friend", 
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  let [submitData, setSubmitData] = useState({})

  const addSubmitData = (data) =>{
    setSubmitData(data)
  }

  const handleFriendSelection = (event) => {
    const friendName = event.target.value;
    if (event.target.checked) {
      setSelectedFriends([...selectedFriends, friendName]);
    } else {
      setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
    }
  };


  const modifyAmount = (temp) =>{
    console.log("amt called");
    setAmount(temp.target.value)
  }
  const modifyName = (temp) =>{
    setName(temp.target.value)
  }


  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    // console.log("Submit data:", submitData);
    // console.log("name=", Name, ".")
    //console.log("l: ", selectedFriends.length)
    // console.log("FEASFD", document.forms[0]);
    var { groupname, paid, friends, pay} = document.forms[0];
    // console.log("HELLO", document.forms[0].elements);
    // console.log("groupname: ", groupname);
    // console.log("paid: ", paid);
    // console.log("friends: ", friends);
    // console.log("pay: ", pay);
    let error = 0
    console.log("length: ", selectedFriends.length);


    if (Name === '')
    {
      error=1
      // console.log("2");
      setErrorMessages({ name: "err_name", message: submit_errors.groupname });
    }
    else if (paid.value <= 0 || paid.value === '')
    {
      error = 2
      console.log("3");
        setErrorMessages({ name: "err_amount", message: submit_errors.amount });
    }
    else if (selectedFriends.length == 0 )
    {
      console.log("4");
      error = 3
      setErrorMessages({ name: "err_friend", message: submit_errors.friend });
    }
    else if(Object.keys(submitData).length === 0 && selectedFriends.length !== 0)
    {
      for (const temp of selectedFriends){
        submitData[temp] = null
      }
    }

    

    // console.log(document.forms[0]);
    // console.log(paid.value);

    // console.log(errorMessages);
    console.log("ADD");
    const transactionIDs = [];
    const userIDs = [currentUser._id];
    const createTransactionURL = 'http://localhost:5050/record/transaction/create';

    console.log("submitdata", submitData);
    console.log("keys: ", Object.keys(submitData));

    for (const borrowerName of Object.keys(submitData)){
      if (submitData[borrowerName] === '' || submitData[borrowerName] == null)
      {
        error = 4

        setErrorMessages({ name: "err_friendamount", message: submit_errors.amount });
        break;
      }
      else if (parseFloat(submitData[borrowerName]) <= 0.00)
      {
        error = 5
        setErrorMessages({ name: "err_friendamount", message: submit_errors.amount });
        break;
      }

    }
    if(error !== 0){
      return
    }

    for (const borrowerName of Object.keys(submitData)){
      console.log("RUNNN")
      // Fetch borrower document

      let borrowerURL = `http://localhost:5050/record/user/username/${borrowerName}`;
      let borrower = await fetch(borrowerURL);

      if(borrower.status !== 200)
        throw new Error("Borrower id not found!");

      borrower = await borrower.json();
      console.log("R", submitData[borrowerName]);
      
      // Create transaction
      let newTransaction = {
        name:  Name,
        loaner: currentUser._id,
        borrower: borrower._id,
        amount: parseFloat(submitData[borrowerName])
      };

      let transactionRes = await fetch(createTransactionURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'   // This needs to be included for proper parsing
        },
        body: JSON.stringify(newTransaction)
      });


      if (transactionRes.status !== 201)
        throw new Error("Couldn't create transaction!");
      
      
      let transactionID = await transactionRes.json();  
      transactionIDs.push(transactionID);
      userIDs.push(borrower._id);


      // Insert the transaction into the borrower document

      let insertURL1 = `http://localhost:5050/record/user/insert/transaction/${borrower._id}`;

      let insertRes1 = await fetch(insertURL1, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: transactionID})
      });

      if(insertRes1.status !== 201)
        throw new Error("Couldn't add transaction to user!");

      
      // Insert the transaction into the current user document
      
      let insertURL2 = `http://localhost:5050/record/user/insert/transaction/${currentUser._id}`;

      let insertRes2 = await fetch(insertURL2, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: transactionID})
      });

      if(insertRes2.status !== 201)
        throw new Error("Couldn't add transaction to user!");
    }


    // Create group with transactions

    const createGroupURL = "http://localhost:5050/record/group/create";

    let newGroup = {
      name: Name,
      members: userIDs,
      transactions: transactionIDs
    };

    let result = await fetch(createGroupURL, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'   // This needs to be included for proper parsing
      },
      body: JSON.stringify(newGroup)
    });


    if (result.status !== 201) 
      throw new Error("Couldn't create group!");
    
    let groupID = await result.json();  // Converts to proper JS Object


    // Add group to all member user documents
    for(let userID of userIDs){
      let insertURL = `http://localhost:5050/record/user/insert/group/${userID}`;

      let insertRes = await fetch(insertURL, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: groupID})
      });

      if(insertRes.status !== 201)
        throw new Error("Couldn't add group to user!");
    }


    // Store the updated user in local storage

    let updatedUser = await fetch(`http://localhost:5050/record/user/${currentUser._id}`);
    updatedUser = await updatedUser.json();
    localStorage.setItem("currentuser", JSON.stringify(updatedUser));
    if (error === 0)
    {setIsSubmitted(true);}
  }


  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Group Name </label>
          <input type="text" onChange={modifyName} name="groupname" required />
          {renderErrorMessage("err_name")}
        </div>
        <div className="input-container">
          <label>You paid ($): </label>
          {/* <input type="number" onChange={modifyAmount} name="paid" required /> */}
          <CurrencyInput name="paid"
          allowNegativeValue={false}  disableAbbreviations={true} disableGroupSeparators={true} required/>
          {renderErrorMessage("err_amount")}
        </div>
        <DropdownMenu
          selectedFriends={selectedFriends}
          handleFriendSelection={handleFriendSelection}
          setData = {addSubmitData}
          errorMessages={errorMessages}
        />
        <div className="button-container">
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </div>
      </form>
    </div>);


  return (
    <div>
      <HomeHeader/>
      <div className="newgroup">
        <div className="newgroup-form">
          {isSubmitted ? <div>Group successfully created</div> : renderForm}
        </div>
      </div>
    </div>);
}