import React, { useState } from "react";
import "./Home.css"
import Header from "./Header";
import HomeHeader from "./HomeHeader";
import { Link } from "react-router-dom";


export default function Home(){
    const [addError, setaddError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const renderFriendErrorMessage = () =>
        (
            <div className="error">{"Cannot find friend"}</div>
        );
    const renderFriendSuccessMessage = () =>
    (
        <div className="success">{"Friend added"}</div>
    );

    const handleSubmit = async (event) => {
        //Prevent page reload
        event.preventDefault();
        setIsSubmitted(true);

        var {friendname} = document.forms[0];
        // console.log("friendname: ", friendname.value);
        // Generate JSX code for error message
        
        const usernameResp = await fetch(`http://localhost:5050/record/user/username/${friendname.value}`);

        if (!usernameResp.ok){ //if friend isnt found
            
            // const message = `An error has occured: ${usernameResp.statusText}`;
            // window.alert(message);
            setaddError(true);
            // console.log("error finding friend");
            return;
        }
        setaddError(false);
        //if friend username is found 
        let friendData;
        try{
            friendData = await usernameResp.json();
            // console.log(friendData);

        } catch (e) {
        console.error(e);
        }

        
        if (friendData)
        {
            let friendID = {id: friendData._id};
            // console.log("friend id: ", friendID.id);            
            let currentUser = JSON.parse(localStorage.getItem('currentuser'));
            // (`http://localhost:5050/record/user/${user}`)
            // console.log("current user", currentUser._id);
            if (friendID._id == currentUser._id)
            {
                window.alert("Cannot add yourself. ");
                setaddError(true);
                return;
            }
            const url = `http://localhost:5050/record/user/insert/friend/${currentUser._id}`;
            let result = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'   // This needs to be included for proper parsing
                },
                body: JSON.stringify(friendID)
            });
            // console.log(result.status);
            if(result.status !== 201) console.log("Error inserting friend ID");
            else {  // Print updated user document
                console.log("Successfully inserted friend!");
                const userURL = `http://localhost:5050/record/user/${currentUser._id}`;
                let res = await fetch(userURL);
                if(res.status === 200){
                    let user = await res.json();
                    console.log("updated user: ", user);
                } else console.log("Error fetching user");
            }
        }
    }
    return (
        <div className="HomeScreen">
            <HomeHeader/>
             <div className="ListScreens">
                <div className="ToPayScreen">
                    <label> Current Transactions To Pay</label>
                    <div className="ListContent">
                        <ul  className="payList">{loadToPayList()}</ul>
                    </div>
                </div>
                <div className="ToBePaidScreen">
                    <label>Current Transactions To Be Paid</label>
                    <div className="ListContent">
                        <ul className="payList">{loadToBePaidList()}</ul>
                    </div>
                </div>
                <div className="FriendsGroupsScreen">
                    <label>Friends </label>
                    <div className="FriendsListContent">
                            <form onSubmit={handleSubmit}>  
                                <div className="searchfriend">
                                    <input type="text" name = "friendname" placeholder="Search for friend" />
                                    <input type="submit" value="Add"/>
                                </div>
                                {isSubmitted ? (addError ? renderFriendErrorMessage(): renderFriendSuccessMessage()) : <></>}
                            </form>
                            <ul className="friendsList">{loadFriendsList()}</ul> 
                    </div>
                </div>
            </div> 
        </div>
    )}


function loadToBePaidList(){
    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <button className="PayLi">
            <label className="Friend_Name">
                {"Friend: "+array}
            </label>
            <label className="Amount">
                Amount: {array}
            </label>
            <Link className= "To_Friend" to = "/Profile"> to Profile</Link>
        
        </button>
    })

}

function loadToPayList(){
    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <button className="PayLi">
            <label className="Friend_Name">
                {"Friend: "+array}
            </label>
            <label className="Amount">
                Amount: {array}
            </label>
            <Link className= "To_Friend" to = "/Profile"> to Profile</Link>
        
        </button>
    })

}

function loadFriendsList(){

    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <button className="FriendLi">
            <label className="Friend">
                {"Friend: "+array}
            </label>
            <Link className= "To_Friend" to = "/Profile"> to Profile</Link>

        
        </button>
    })

}