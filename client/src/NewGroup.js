import React, { useState, useEffect, useRef } from "react";
import "./NewGroup.css";
import Header from "./Header";

const DropdownMenu = ({ selectedFriends, handleFriendSelection }) => {
  const [amounts, setAmounts] = useState({});
  const dropdownRef = useRef(null);

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
      if (!dropdownRef.current.contains(e.target)) {
        dropdownRef.current.classList.remove("is-active");
      }
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const friends = [
    { name: "Ian", amount: 0 },
    { name: "Cris", amount: 0 },
    { name: "Henry", amount: 0 },
    { name: "Steph", amount: 0 },
  ];

  return (
    <div className="dropdown-container">
      <div className="dropdown-menu checkbox-dropdown" ref={dropdownRef} onClick={handleDropdownToggle}>
        <h4>Select friends:</h4>
        <ul className="checkbox-dropdown-list" onClick={handleDropdownClick}>
          {friends.map((friend) => (
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

  const handleFriendSelection = (event) => {
    const friendName = event.target.value;
    if (event.target.checked) {
      setSelectedFriends([...selectedFriends, friendName]);
    } else {
      setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
    }
  };

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();
    var { transname,amount} = document.forms[0];
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  }

  const renderForm = (
  <div className="form">
    <form onSubmit={handleSubmit}>
      <div className="input-container">
        <label>Group Name </label>
        <input type="text" name="groupname" required />
      </div>
      <div className="input-container">
        <label>You paid </label>
        <input type="number" name="paid" required />
      </div>
      <DropdownMenu
        selectedFriends={selectedFriends}
        handleFriendSelection={handleFriendSelection}
      />
    </form>
    <div className="button-container">
      <input type="submit" value="Submit" />
    </div>
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
