import React, { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
    const [theme, setTheme] = useState('light'); 

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
        localStorage.setItem('Theme', event.target.value);
      };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);


    return (
        <header className={`Header ${theme}`}>
            <h1 className="icon">D.J.S<br />🎙️11🎙️</h1>
            <div className="theme-dropdown">
                <select value={theme} onChange={handleThemeChange}>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                </select>
            </div>
        </header>
    );
}
