
import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import HomeHeader from "./HomeHeader";
import { Link } from "react-router-dom";


export default function Home(){
    const [addError, setaddError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [rerender, setRerender] = useState(true);
    let toBePaidList = useRef([]);
    let toPayList = useRef([]);
    let friends = useRef([]);
    let isFetching1 = useRef(true);
    let isFetching2 = useRef(true);



    const setAsPaid = async(id) =>{

        console.log("the id: ", id)
        let url = "http://localhost:5050/record/transaction/setAsPaid/"+id
        let result = await fetch(url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({set: true})
        })
        if (result.status !== 201){
            console.log( await result.json())
            throw new Error("Couldn't create transaction!");
        }


    }


    useEffect(() => {

        let user = JSON.parse(localStorage.getItem('currentuser'));
        let transactionIDs = user.transactions;
        let friendIDs = user.friends;

        loadPayLists();
        loadFriendList();


        // Load Transaction Lists
        async function loadPayLists(){

            let tempToBePaidList = [];
            let tempToPayList = [];

            for(let transactionID of transactionIDs){
                let transactionURL = `http://localhost:5050/record/transaction/${transactionID}`;

                let res = await fetch(transactionURL);

                if(res.status !== 200)
                    throw new Error("Invalid transaction ID in user!");
                
                let transaction = await res.json();

                let loanerURL = `http://localhost:5050/record/user/${transaction.loaner}`;
                let borrowerURL = `http://localhost:5050/record/user/${transaction.borrower}`;
                let loaner = await fetch(loanerURL);
                let borrower = await fetch(borrowerURL);

                if(loaner.status !== 200 || borrower.status !== 200)
                    throw new Error("Invalid user in transaction!");
                

                if(!transaction.isPaid){
                    loaner = await loaner.json();
                    borrower = await borrower.json();

                    let entry = {
                        user: null, // This is the user you borrowed/lent money from/to
                        amount: transaction.amount,
                        id: transaction._id
                    };

                    if(loaner.username === user.username){
                        entry.user = borrower.username;
                        tempToBePaidList.push(JSON.parse(JSON.stringify(entry)));
                    } else if(borrower.username === user.username) {
                        entry.user = loaner.username;
                        tempToPayList.push(JSON.parse(JSON.stringify(entry)));
                    } else
                        throw new Error("Transaction doesn't involve current user!");
                }
                
            }
            toPayList.current = tempToPayList;
            toBePaidList.current = tempToBePaidList;

            if(isFetching1.current && !isFetching2.current)
                setRerender(!rerender);

            isFetching1.current = false;
        }


        // Load Friend List
        async function loadFriendList() {
    
            let friendArray = [];
    
            for (const friendID of friendIDs){
    
                const url = "http://localhost:5050/record/user/"+ friendID;
                let result = await fetch(url);
                if(result.status === 200){ 
                    const friendData = await result.json();
                    const tempData = {name: friendData["username"]};
                    friendArray.push(tempData);
                }
                else console.log("Error sending request");
            }
            friends.current = friendArray;

            if(isFetching2.current && !isFetching1.current)
                setRerender(!rerender);

            isFetching2.current = false;
        }

    }, [rerender]);


    const setFriendProfileID = async(id)=>{
        localStorage.setItem("currentfriend",id);
    }

    // Create the elements based off the updated object lists
    let toPayElement;
    let toBePaidElement;
    let friendsElement;

    let fetching = isFetching1.current || isFetching2.current;

    if(fetching)
        toPayElement = null;
    else if(toPayList.current.length === 0)
        toPayElement = (
            <h3>Nothing to see here!</h3>
        );
    else
        toPayElement = toPayList.current.map((transaction) => {
            return (
            <button className="PayLi">
                <label className="Friend_Name">
                    {transaction.user}
                </label>
                <label className="Amount">
                    Amount: ${transaction.amount}
                </label>
                <Link className= "To_Friend" to = "/Profile"> to Profile</Link>
                <button onClick={function(){
                    setAsPaid(transaction.id)
                }}> Set As Paid</button>
            </button>);
        });


    if(fetching)
        toBePaidElement = null;
    else if(toBePaidList.current.length === 0)
        toBePaidElement = (
            <h3>Nothing to see here!</h3>
        );
    else
        toBePaidElement = toBePaidList.current.map((transaction) => {
            return (
            <button className="PayLi">
                <label className="Friend_Name">
                    {transaction.user}
                </label>
                <label className="Amount">
                    Amount: ${transaction.amount}
                </label>
                <Link className= "To_Friend" to = "/Profile"> to Profile</Link>
            </button>);
        });


    if(fetching)
        friendsElement = null;
    else if(friends.current.length === 0)
        friendsElement = (
            <h3>Nothing to see here!</h3>
        );
    else
        friendsElement = friends.current.map((friend) => {
            return (
            <button className="FriendLi">
                <label className="Friend">
                    {friend.name}
                </label>
                <Link className= "To_Friend" onClick={()=>{setFriendProfileID(friend.name)}} to = "/FriendProfile"> View Profile</Link>
            </button>);
        });



    // Accepting new friend stuff
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

        if (usernameResp.status !== 200){ //if friend isnt found
            
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
        } catch (e) {
            console.error(e);
        }

        
        if (friendData) {
            let friendID = {id: friendData._id};
            let currentUser = JSON.parse(localStorage.getItem('currentuser'));

            if (friendID.id === currentUser._id) {
                window.alert("Cannot add yourself.");
                setaddError(true);
                return;
            } else if(currentUser.friends.includes(friendID.id)){
                window.alert("You already added this friend.");
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
                    localStorage.setItem('currentuser', JSON.stringify(user));
                } else console.log("Error fetching user");
            }
        }
    }


    // Construct the final JSX elements
    return (
        <div className="HomeScreen">
            <HomeHeader/>
            <div className="ListScreens">
                <div className="ToPayScreen">
                    <label> Current Transactions To Pay</label>
                    <div className="ListContent">
                        <ul  className="payList">{toPayElement}</ul>
                    </div>
                </div>
                <div className="ToBePaidScreen">
                    <label>Current Transactions To Be Paid</label>
                    <div className="ListContent">
                        <ul className="payList">{toBePaidElement}</ul>
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
                        <ul className="friendsList">{friendsElement}</ul>
                    </div>
                </div>
            </div> 
        </div>
    );
}