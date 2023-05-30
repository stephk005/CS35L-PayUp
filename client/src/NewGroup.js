import React, { useState } from "react";
import "./NewGroup.css";
import HomeHeader from "./HomeHeader";
import CurrencyInput from 'react-currency-input-field';

const DropdownMenu = ({ selectedFriends, handleFriendSelection }) => {
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (event, friendName) => {
    const newAmounts = { ...amounts, [friendName]: event.target.value };
    setAmounts(newAmounts);
  };

  const friends = [
    { name: "Ian", amount: 0 },
    { name: "Cris", amount: 0 },
    { name: "Henry", amount: 0 },
    { name: "Steph", amount: 0 },
  ];

  return (
    <div className="dropdown-container">
      <div className="dropdown-menu">
        <h4>Select friends:</h4>
        {friends.map((friend) => (
          <label key={friend.name}>
            {friend.name}
            <input
              type="checkbox"
              value={friend.name}
              checked={selectedFriends.includes(friend.name)}
              onChange={handleFriendSelection}
            />
          </label>
        ))}
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

  const handleFriendSelection = (event) => {
    const friendName = event.target.value;
    if (event.target.checked) {
      setSelectedFriends([...selectedFriends, friendName]);
    } else {
      setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
    }
  };

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
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    // console.log("newgroup ", currentUser);
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

  const renderForm = (
    <div className="newgroup">
      <div className="form">
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
        <DropdownMenu
          selectedFriends={selectedFriends}
          handleFriendSelection={handleFriendSelection}
        />
        <input type="submit" />
      </div>
    </div>
  );

  return (
    <div>
      <HomeHeader/>
      <div className="newgroup">
        <div className="newgroup-form">
          {isSubmitted ? <div>Group successfully created</div> : renderEntryForm}
        </div>
      </div>
    </div>
  );
}
