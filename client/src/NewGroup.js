import React, { useState } from "react";
import "./NewGroup.css";
import HomeHeader from "./HomeHeader";

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

  const handleFriendSelection = (event) => {
    const friendName = event.target.value;
    if (event.target.checked) {
      setSelectedFriends([...selectedFriends, friendName]);
    } else {
      setSelectedFriends(selectedFriends.filter((friend) => friend !== friendName));
    }
  };

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
          {isSubmitted ? <div>Group successfully created</div> : renderForm}
        </div>
      </div>
    </div>
  );
}
