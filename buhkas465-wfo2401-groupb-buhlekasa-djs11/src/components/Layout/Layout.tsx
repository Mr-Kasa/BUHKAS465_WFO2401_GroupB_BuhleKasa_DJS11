import React from "react";
import "./Layout.css"
import Header from "../Header/Header";
import Player from "../Player/player";
import { Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <div className="Layout">
        <Header/>
        <Outlet/>
        <Player/>
        </div>
    )
}