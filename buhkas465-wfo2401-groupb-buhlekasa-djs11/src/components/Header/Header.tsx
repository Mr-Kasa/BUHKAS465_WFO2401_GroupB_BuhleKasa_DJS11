import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// Define the possible theme values
type Theme = 'light' | 'dark';

const Header: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as Theme;
    setTheme(selectedTheme);
    localStorage.setItem('Theme', selectedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('Theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <header className={`Header ${theme}`}>
      <Link className="site-logo" to="/"><h1 className="icon">D.J.S<br />🎙️11🎙️</h1></Link>
      
      
      <div className="theme-dropdown">
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
