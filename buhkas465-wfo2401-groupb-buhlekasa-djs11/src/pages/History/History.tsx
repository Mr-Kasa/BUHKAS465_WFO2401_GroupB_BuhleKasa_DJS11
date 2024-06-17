import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noHistory, setNoHistory] = useState(false);

  useEffect(() => {
    // Simulate a delay to fetch history data
    setTimeout(() => {
      const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
      const storedEpisodes = JSON.parse(localStorage.getItem('episodes')) || [];

      const updatedHistory = storedHistory.map(episode => {
        const matchingEpisode = storedEpisodes.find(ep => ep.episodeId === episode.episodeId);
        if (matchingEpisode) {
          return {
            ...episode,
            seasonImage: matchingEpisode.seasonImage, // Get only the season image
            isFavourite: matchingEpisode.isFavourite // Get isFavourite status
          };
        }
        return episode;
      });

      setHistory(updatedHistory);
      setLoading(false);
      setNoHistory(updatedHistory.length === 0);
    }, 1000); // Adjust the delay as needed
  }, []);

  useEffect(() => {
    // Update local storage whenever history changes
    if (!loading) {
      localStorage.setItem('history', JSON.stringify(history));
      setNoHistory(history.length === 0);
    }
  }, [history, loading]);

  const clearHistory = () => {
    // Clear the history in state and local storage
    setHistory([]);
    localStorage.setItem('history', JSON.stringify([]));
    setNoHistory(true);
  };

  const toggleFavourite = (episode) => {
    const storedEpisodes = JSON.parse(localStorage.getItem('episodes')) || [];

    const updatedEpisodes = storedEpisodes.map((ep) => {
      if (ep.episodeId === episode.episodeId) {
        return { ...ep, isFavourite: !ep.isFavourite };
      }
      return ep;
    });

    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));

    const updatedHistory = history.map((ep) => {
      if (ep.episodeId === episode.episodeId) {
        return { ...ep, isFavourite: !ep.isFavourite };
      }
      return ep;
    });

    setHistory(updatedHistory);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={clearHistory}>Clear History</button>
        <h1>History List</h1>
      </div>
      {noHistory ? (
        <p>No history items found.</p>
      ) : (
        <ul>
          {history.map((episode) => (
            <li key={episode.episodeId}>
              <img src={episode.seasonImage} alt={episode.episodeTitle} />
              <h3>{episode.episodeTitle}</h3>
              <p>Last played: {new Date(episode.playedAt).toLocaleString()}</p>
              <Link
                to={{
                  pathname: "/episode-preview",
                  state: { season: episode }
                }}
              >
                <button>Preview</button>
              </Link>
              <button onClick={() => toggleFavourite(episode)}>
                {episode.isFavourite ? 'Unfavourite' : 'Favourite'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


