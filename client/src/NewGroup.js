import React, { useState, useEffect, useRef } from "react";
import "./NewGroup.css";
import HomeHeader from "./HomeHeader";



const DropdownMenu = ({ selectedFriends, handleFriendSelection, setData}) => {
 
  const dropdownRef = useRef(null);
  const [amounts, setAmounts] = useState({});
  const [rerender, setRerender] = useState(true);
  let isFetching = useRef(true);
  let friends = useRef([]);


  const handleAmountChange = (event, friendName) => {
    const newAmounts = { ...amounts, [friendName]: event.target.value };
    setAmounts(newAmounts);
  };

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
        {selectedFriends.length > 0 && (
          <div className="selected-friends">
            <h4>Selected Friends:</h4>
            {selectedFriends.map((friend) => (
              <div key={friend}>
                {friend}: <input type="number" value={amounts[friend]} onChange={(event) => handleAmountChange(event, friend)} />
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

  let [submitData, setSubmitData] = useState({})

  const addData = (data) =>{
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
    setAmount(temp.target.value)

  }
  const modifyName = (temp) =>{
    setName(temp.target.value)
  }


  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));

    const addData = async() =>{

      const transactionIDs = [];
      const userIDs = [currentUser._id];
      const createTransactionURL = 'http://localhost:5050/record/transaction/create';

      for (const borrowerName of Object.keys(submitData)){

        // Fetch borrower document

        let borrowerURL = `http://localhost:5050/record/user/username/${borrowerName}`;
        let borrower = await fetch(borrowerURL);

        if(borrower.status !== 200)
          throw new Error("Borrower id not found!");

        borrower = await borrower.json();


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
      setIsSubmitted(true);
    }

    addData();
  }


  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Group Name </label>
          <input type="text" onChange={modifyName} name="groupname" required />
        </div>
        <div className="input-container">
          <label>You paid </label>
          <input type="number" onChange={modifyAmount} name="paid" required />
        </div>
        <DropdownMenu
          selectedFriends={selectedFriends}
          handleFriendSelection={handleFriendSelection}
          setData = {addData}
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