import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import './InnerLayout.css'


export default function HostLayout() {
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <>
            <nav className="InnertLayout-nav">
                <NavLink
                    to="."
                    end
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Home
                </NavLink>

                <NavLink
                    to="History"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    History
                </NavLink>
                
                <NavLink
                    to="Favourites"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Favourites
                </NavLink>

            </nav>
            <Outlet />
        </>
    )
}