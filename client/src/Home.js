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
                    <div className="listContent">
                        <ul  className="toPayList">{loadToPayList()}</ul>
                    </div>
                </div>
                <div className="ToBePaidScreen">
                    <div className="listContent">
                        <ul className="toBePaidList">{loadToBePaidList()}</ul>
                    </div>
                </div>
                <div className="FriendsGroupsScreen">
                <div className="listContent">
                    <label>Friends</label>
                        <ul className="toBePaidList">{loadToBePaidList()}</ul> 
                    </div>
                    <label>Groups</label>
                </div>
            </div> 
        </div>
    )
    }


function loadToBePaidList(){
    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <li>{"list entry: "+array}</li>
    })

}

function loadToPayList(){
    let array = [1,2,3,4,5,6,7,8,9,0]
    return array.map((array)=>{
        return <li>{"list entry: "+array}</li>
    })

}