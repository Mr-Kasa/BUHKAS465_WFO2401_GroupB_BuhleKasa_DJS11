import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentDateTime } from '../../UtilFunctions';
import "./History.css";

// Function to extract episode number from episodeId
const getEpisodeNumber = (episodeId) => {
  const parts = episodeId.split('-');
  return parts[parts.length - 1];
};

// Function to extract season number from episodeId
const getSeasonNumber = (episodeId) => {
  const parts = episodeId.split('-');
  return parts[parts.length - 2];
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noHistory, setNoHistory] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    const storedEpisodes = JSON.parse(localStorage.getItem('episodes')) || [];

    const updatedHistory = storedHistory.map(episode => {
      const matchingEpisode = storedEpisodes.find(ep => ep.episodeId === episode.episodeId);
      if (matchingEpisode) {
        return {
          ...episode,
          seasonImage: matchingEpisode.seasonImage, // Get only the season image
          isFavourite: matchingEpisode.isFavourite, // Get isFavourite status
          showTitle: matchingEpisode.showTitle // Get the show title
        };
      }
      return episode;
    });

    setHistory(updatedHistory);
    setLoading(false);
    setNoHistory(updatedHistory.length === 0);
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
        return { 
          ...ep, 
          isFavourite: !ep.isFavourite,
          dateFavourited: !ep.isFavourite ? getCurrentDateTime() : "" 
        };
      }
      return ep;
    });

    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));

    const updatedHistory = history.map((ep) => {
      if (ep.episodeId === episode.episodeId) {
        return { 
          ...ep, 
          isFavourite: !ep.isFavourite,
          dateFavourited: !ep.isFavourite ? getCurrentDateTime() : "" 
        };
      }
      return ep;
    });

    setHistory(updatedHistory);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
 
        <button className="clear-button" onClick={clearHistory}>Clear History</button>
      </div>
      <div className="HistoryItemLayout">
      {noHistory ? (
        <p className="no-history">No history items found.</p>
      ) : (
        <ul className="history-list">
          {history.map((episode) => (
            <li className="history-item" key={episode.episodeId}>
              <img src={episode.seasonImage} alt={episode.episodeTitle} className="episode-image" />
              <h3>{episode.episodeTitle}</h3> 
              <h3>{episode.showTitle}</h3> 
              <p>{`EP - ${getEpisodeNumber(episode.episodeId)}`}</p>
              <p>{`Season - ${getSeasonNumber(episode.episodeId)}`}</p> 
              <p>Last played: {new Date(episode.playedAt).toLocaleString()}</p>
              <Link
                to={{
                  pathname: "/episode-preview",
                  state: { season: episode }
                }}
              >
                <button className="preview-button">Preview</button>
              </Link>
              <button className="favourite-button" onClick={() => toggleFavourite(episode)}>
                {episode.isFavourite ? '❤️' : '♡'}
              </button>
            </li>
          ))}
        </ul>
      )}
     </div>
    </div>
  );
}


