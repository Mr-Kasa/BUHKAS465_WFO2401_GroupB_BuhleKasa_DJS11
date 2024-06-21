import React, { useState, useEffect } from "react";
import { getCurrentDateTime } from '../../UtilFunctions';
import "./History.css";
import { Episode } from "../../types";

/**
 * Function to extract episode number from episodeId.
 * 
 * @param {string} episodeId - The ID of the episode.
 * @returns {string} The episode number.
 */
const getEpisodeNumber = (episodeId: string): string => {
  const parts = episodeId.split('-');
  return parts[parts.length - 1];
};

/**
 * Function to extract season number from episodeId.
 * 
 * @param {string} episodeId - The ID of the episode.
 * @returns {string} The season number.
 */
const getSeasonNumber = (episodeId: string): string => {
  const parts = episodeId.split('-');
  return parts[parts.length - 2];
};

/**
 * Component to display and manage viewing history of episodes.
 * 
 * @returns {JSX.Element} The History component.
 */
const History: React.FC = () => {
  const [history, setHistory] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noHistory, setNoHistory] = useState<boolean>(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history') || '[]') as Episode[];
    const storedEpisodes = JSON.parse(localStorage.getItem('episodes') || '[]') as Episode[];

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

  const toggleFavourite = (episode: Episode) => {
    const storedEpisodes = JSON.parse(localStorage.getItem('episodes') || '[]') as Episode[];

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
        <div className="custom-button clear-button" onClick={clearHistory}>
          <h2>Clear History</h2>
        </div>
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
                <div className="custom-button favourite-button" onClick={() => toggleFavourite(episode)}>
                  <h2>{episode.isFavourite ? '❤️' : '♡'}</h2>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default History;



