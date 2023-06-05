import React, { useState, useEffect, useRef } from "react";
import "./NewGroup.css";
import HomeHeader from "./HomeHeader";



const DropdownMenu = ({ selectedFriends, handleFriendSelection, setData}) => {
 
  const dropdownRef = useRef(null);
  const [amounts, setAmounts] = useState({});
  const [friends, setFriends] = useState(Array());
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
  const friendList = async() => {
    let currentUser = (JSON.parse(localStorage.getItem("currentuser")))["_id"]
    let friend_Array = []
    const url = "http://localhost:5050/record/user/"+ currentUser
    let result = await fetch(url)

    if(result.ok){ 
      //console.log(await result.json()); 
      const userData = await result.json();
      for (const friendID of userData["friends"]){
          //console.log(friendID)

          const url2 = "http://localhost:5050/record/user/"+ friendID
          let result2 = await fetch(url2)
          if(result2.ok){ 
            //console.log(await result2.json()); 
            const friendData = await result2.json();
            const tempData = {name: friendData["username"], amount: 0}
            friend_Array.push(tempData)
          }
          else console.log("Error sending request");
        
        

      }


    }
    else{
       console.log("Error sending request");
    }
    console.log(friend_Array)

    setFriends(friend_Array)
  }
  friendList()


  return (

    <div className="dropdown-container">
      <div>
        {setData(amounts)}
      </div>
      <div className="dropdown-menu checkbox-dropdown" ref={dropdownRef} onClick={handleDropdownToggle}>
        <h4>Select friends:</h4>
        <ul className="checkbox-dropdown-list" onClick={handleDropdownClick}>
          {
            friends.map((friend) => (
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
  const [Name,setName] = useState("")

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


  // console.log("clicked");

  // console.log(selectedFriends);
  //console.log(submitData);



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
        const id_data = []
        const url = 'http://localhost:5050/record/transaction/create'
        for (const borrower of Object.keys(submitData)){
            let newTransaction = {
              name:  Name,
              loaner: currentUser["username"],
              borrower: borrower,
              amount:submitData[borrower]
            };
            console.log("data: "+newTransaction)
            let result = await fetch(url, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json'   // This needs to be included for proper parsing
              },
              body: JSON.stringify(newTransaction)

            });
            console.log(result.statusText);
            if (result.status !== 201) console.log(await result.text());  // Logs errors
            else {
                let id = await result.json();  
                id_data.push(id)
            }
        }
        const url2 = "http://localhost:5050/record/group/create"
        let temp = Object.keys(submitData)
        temp.push(currentUser["username"])
        let data = {
          name: Name,
          members: temp,
          transactions: id_data
        }
        let result2 = await fetch(url2, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'   // This needs to be included for proper parsing
          },
          body: JSON.stringify(data)
        });

        console.log(result2.statusText);

        if (result2.status !== 201) console.log(await result2.text());  // Logs errors
        else {
              let id = await result2.json();  // Converts to proper JS Object
              console.log(id);

        }

      }
      addData()
    }





    // const url = 'http://localhost:5050/group/create'

    

      

    //   let dataToAdd = {

    //     name: "",
    //     members: Object.keys(submitData);,
    //     transactions: {}
    //   }


    //   let result = await fetch(url, {
    //       method: "POST",
    //       headers: {
    //           'Content-Type': 'application/json'   // This needs to be included for proper parsing
    //       },
    //       body: JSON.stringify(dataToAdd)
    //   });


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



