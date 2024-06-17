import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Retrieve history data from local storage
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  }, []);

  const clearHistory = () => {
    // Clear the history in state and local storage
    setHistory([]);
    localStorage.setItem('history', JSON.stringify([]));
  };

  return (
    <div>
      <div>
        <button onClick={clearHistory}>Clear History</button>
        <h1>History List</h1>
      </div>
      <ul>
        {history.map((episode, index) => (
          <li key={index}>
            <h3>{episode.episodeTitle}</h3>
            <img src={episode.seasonImage} alt={episode.seasonTitle} />
            <Link
              to={{
                pathname: "/episode-preview",
                state: { season: episode }
              }}
            >
              <button>Preview</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
