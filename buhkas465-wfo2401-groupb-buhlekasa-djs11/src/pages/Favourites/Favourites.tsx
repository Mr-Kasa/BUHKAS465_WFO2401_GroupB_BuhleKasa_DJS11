import React, { useState, useEffect } from 'react';
import './Favourite.css';
import {
  sortEpisodesByTitleAZ,
  sortEpisodesByTitleZA,
  sortEpisodesByDateOldest,
  sortEpisodesByDateNewest,
  getCurrentDateTime
} from '../../UtilFunctions';
import { Episode } from '../../types';

/**
 * Retrieves episodes from local storage.
 * 
 * @returns {Episode[]} An array of episodes.
 */
const getEpisodesFromLocalStorage = (): Episode[] => {
  const episodes = localStorage.getItem('episodes');
  return episodes ? JSON.parse(episodes) : [];
};

/**
 * Extracts the episode number from the episode ID.
 * 
 * @param {string} episodeId - The ID of the episode.
 * @returns {string} The episode number.
 */
const getEpisodeNumber = (episodeId: string): string => {
  const parts = episodeId.split('-');
  return parts[parts.length - 1];
};

/**
 * Extracts the season number from the episode ID.
 * 
 * @param {string} episodeId - The ID of the episode.
 * @returns {string} The season number.
 */
const getSeasonNumber = (episodeId: string): string => {
  const parts = episodeId.split('-');
  return parts[parts.length - 2];
};

/**
 * Sorts episodes by their episode ID.
 * 
 * @param {Episode[]} episodes - The array of episodes to be sorted.
 * @returns {Episode[]} The sorted array of episodes.
 */
const sortEpisodesByEpisodeId = (episodes: Episode[]): Episode[] => {
  try {
    // Sorting function by episodeId
    const sortedEpisodes = episodes.sort((a, b) => {
      return a.episodeId.localeCompare(b.episodeId);
    });
    console.log('Sorted episodes by episodeId:', sortedEpisodes.map(ep => ep.episodeId));
    return sortedEpisodes;
  } catch (error) {
    console.error('Error sorting episodes by episodeId:', error);
    return episodes; // Return unsorted episodes in case of error
  }
};

/**
 * Favourites component to display and manage favourite episodes.
 * 
 * @returns {JSX.Element} The Favourites component.
 */
const Favourites: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortByTitle, setSortByTitle] = useState<string | null>(null); // null means no sorting
  const [sortByDate, setSortByDate] = useState<string | null>(null); // null means no sorting

  // Effect to load and sort episodes on mount
  useEffect(() => {
    const storedEpisodes = getEpisodesFromLocalStorage();
    const sortedEpisodes = sortEpisodesByEpisodeId([...storedEpisodes]);
    setEpisodes(sortedEpisodes);
    setLoading(false);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * Toggles the favourite status of an episode.
   * 
   * @param {Episode} episode - The episode to toggle favourite status.
   */
  const toggleFavourite = (episode: Episode) => {
    const updatedEpisodes = episodes.map((ep) => {
      if (ep.episodeId === episode.episodeId) {
        const updatedEpisode = {
          ...ep,
          isFavourite: !ep.isFavourite,
          dateFavourited: !ep.isFavourite ? getCurrentDateTime() : ""
        };
        return updatedEpisode;
      }
      return ep;
    });

    setEpisodes(updatedEpisodes);
    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));
  };

  /**
   * Handles sorting episodes by title.
   */
  const handleSortTitle = () => {
    let sortedEpisodes;
    if (sortByTitle === 'AZ') {
      sortedEpisodes = sortEpisodesByTitleZA([...episodes]);
      setSortByTitle('ZA');
    } else {
      sortedEpisodes = sortEpisodesByTitleAZ([...episodes]);
      setSortByTitle('AZ');
    }
    setEpisodes(sortedEpisodes);
    setSortByDate(null); // Deactivate date sorting
  };

  /**
   * Handles sorting episodes by date.
   */
  const handleSortDate = () => {
    let sortedEpisodes;
    if (sortByDate === 'Newest') {
      sortedEpisodes = sortEpisodesByDateOldest([...episodes]);
      setSortByDate('Oldest');
    } else {
      sortedEpisodes = sortEpisodesByDateNewest([...episodes]);
      setSortByDate('Newest');
    }
    setEpisodes(sortedEpisodes);
    setSortByTitle(null); // Deactivate title sorting
  };

  // Effect to log episodeIds of favourite episodes after any sorting
  useEffect(() => {
    const favouriteSortedIds = episodes.filter(ep => ep.isFavourite).map(ep => ep.episodeId);
    console.log('Favourite episodes sorted:', favouriteSortedIds);
  }, [episodes]); // Effect runs whenever episodes state changes

  const favouriteEpisodes = episodes.filter(ep => ep.isFavourite);

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <div className="sort-buttons">
          <div className="custom-button sortAZ" onClick={handleSortTitle}>
            <h2>{sortByTitle === 'AZ' ? 'Sort A-Z by Title' : 'Sort Z-A by Title'}</h2>
          </div>
          <div className="custom-button sortDate" onClick={handleSortDate}>
            <h2>{sortByDate === 'Newest' ? 'Sort Newest-Oldest by Date' : 'Sort Oldest-Newest by Date'}</h2>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : favouriteEpisodes.length > 0 ? (
        <div className="favourites-list">
          {favouriteEpisodes.map((storedEpisode) => (
            <div className="favourites-item" key={storedEpisode.episodeId}>
              <img className='seasonImage' src={storedEpisode.seasonImage} alt={storedEpisode.episodeTitle} />
              <h2>{storedEpisode.episodeTitle}</h2>
              <p>{`Show: ${storedEpisode.showTitle}`}</p>
              <p>{`Episode: ${getEpisodeNumber(storedEpisode.episodeId)}`}</p>
              <p>{`Season: ${getSeasonNumber(storedEpisode.episodeId)}`}</p>
              <p>{`Favourited On: ${storedEpisode.dateFavourited}`}</p>
              <div className="custom-button favourite-button" onClick={() => toggleFavourite(storedEpisode)}>
                <h2>{storedEpisode.isFavourite ? '❤️' : '♡'}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-favourites">No favourite episodes found.</p>
      )}
    </div>
  );
};

export default Favourites;

