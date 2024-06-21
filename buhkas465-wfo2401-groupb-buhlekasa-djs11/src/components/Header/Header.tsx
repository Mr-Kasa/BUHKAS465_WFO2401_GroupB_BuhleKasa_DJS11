import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

/**
 * Type definition for the theme.
 * Possible values are 'light' or 'dark'.
 */
type Theme = 'light' | 'dark';

/**
 * Header component that allows the user to switch between light and dark themes.
 * The selected theme is persisted in local storage and applied to the document.
 *
 * @returns {JSX.Element} The Header component.
 */
const Header: React.FC = () => {
  // State to manage the current theme, default is 'light'
  const [theme, setTheme] = useState<Theme>('light');

  /**
   * Handles theme change when the user selects a different option from the dropdown.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event from the dropdown.
   */
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as Theme;
    setTheme(selectedTheme);
    localStorage.setItem('Theme', selectedTheme);
  };

  /**
   * Effect hook to load the saved theme from local storage when the component mounts
   * and apply the theme to the document. The effect also runs whenever the theme changes.
   */
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
