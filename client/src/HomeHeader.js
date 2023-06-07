import React, { useState, useEffect, useRef } from "react";
import "./HomeHeader.css";
import { Link } from "react-router-dom";


export default function HomeHeader() {
    const [balance, setBalance] = useState();

    useEffect(() => {

        let user = JSON.parse(localStorage.getItem('currentuser'));
        let transactionIDs = user.transactions;
        
        let net = 0;
        loadPayLists();
        

        async function loadPayLists(){
        for(let transactionID of transactionIDs){
            let transactionURL = `http://localhost:5050/record/transaction/${transactionID}`;

            let res = await fetch(transactionURL);

            if(res.status !== 200)
                throw new Error("Invalid transaction ID in user!");   
            let transaction = await res.json();
            
            if(!transaction.isPaid){
                if(transaction.loaner === user._id){
                    net += transaction.amount;
                } else if(transaction.borrower === user._id) {
                    net -= transaction.amount;
                } else {
                    throw new Error("Error calculating balance!");
                }
            }
        }
        setBalance(net);

}}, []);

    // const handleClick = async (event) => {
        // event.preventDefault();
        // console.log("CLICK BALANCE", localStorage);
        // let currentUser = JSON.parse(localStorage.getItem('currentuser')) 
        // let friends = currentUser.friends; //grab list of friends given user
        // // console.log("friend id", friends[0]);
        // let friend = friends[0]; // temp friend -> first friend on friends list
        // const friendidResp = await fetch(`http://localhost:5050/record/user/${friend}`);

        // //fetch friend data 
        // if (friendidResp.statusText !== "Not Found" && !friendidResp.ok){
        //     const message = `An error has occured: ${friendidResp.statusText}`;
        //     window.alert(message);
        //     return;
        // }
        // let friendData;
        // try{
        // friendData = await friendidResp.json();
        // // console.log("friend data: ", friendData);
        // localStorage.setItem("currentfriend", JSON.stringify(friendData));
        // console.log("CLICK BALANCE BOT ", localStorage);
        // navigate("/FriendProfile")
        // } catch (e) {
        // console.error(e);
        // }
    // };
    return (
        <div className="homeheader">
            <div className="homeheader_welcome">
            <Link className = "homeheader_link" to="/Home">Home</Link>
            </div>
            <div className="homeheader_balance">
            {/* <Link className = "homeheader_link" to="/FriendProfile" onClick={() => handleClick()} >Balance</Link> */}
            <label>Balance: ${balance}</label>
            </div>
            <div className="homeheader_tempgroup_link">
            <Link className = "homeheader_link" to="/Group">Group</Link>
            </div>
            <div className="homeheader_profile_link">
            <Link className = "homeheader_link" to="/Profile">Profile</Link>
            </div>
        </div>
          
      );
}

