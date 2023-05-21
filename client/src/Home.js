import React, { useState } from "react";
import "./Home.css"
import Header from "./Header";
import HomeHeader from "./HomeHeader";

export default function Home(){
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
                            <ul className="friendsList">{loadFriendsList()}</ul> 
                    </div>
                    <label>Groups</label>
                    <div className="FriendsListContent">
                            <ul className="friendsList">{loadGroupsList()}</ul> 
                    </div>
                </div>
            </div> 
        </div>
    )
    }


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
        
        </button>
    })

}

function loadGroupsList(){
    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <button className="FriendLi">
            <label className="Friend">
                {"Friend: "+array}
            </label>
        
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
        
        </button>
    })

}