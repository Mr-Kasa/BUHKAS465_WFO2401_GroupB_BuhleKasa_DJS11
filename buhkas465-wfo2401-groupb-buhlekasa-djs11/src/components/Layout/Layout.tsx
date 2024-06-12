import React from "react";
import Header from "../Header/Header";
import Player from "../Player/player";
import { Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        <Player/>
        </>
    )
}