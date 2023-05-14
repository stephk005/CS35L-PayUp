import React, { useState } from "react";
import "./Home.css"
import Header from "./Header";


export default function Home(){
    return (
        <div className="HomeScreen">
            <Header/>
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