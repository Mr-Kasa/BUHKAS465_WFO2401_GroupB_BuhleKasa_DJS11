import React, { useState, useEffect } from 'react';
import './Favourite.css';
import {
  sortEpisodesByTitleAZ,
  sortEpisodesByTitleZA,
  sortEpisodesByDateOldest,
  sortEpisodesByDateNewest,
  getCurrentDateTime
} from '../../UtilFunctions';

const getEpisodesFromLocalStorage = () => {
  const episodes = localStorage.getItem('episodes');
  return episodes ? JSON.parse(episodes) : [];
};

const getEpisodeNumber = (episodeId) => {
  const parts = episodeId.split('-');
  return parts[parts.length - 1];
};

const getSeasonNumber = (episodeId) => {
  const parts = episodeId.split('-');
  return parts[parts.length - 2];
};

const sortEpisodesByEpisodeId = (episodes) => {
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

const Favourites = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByTitle, setSortByTitle] = useState(null); // null means no sorting
  const [sortByDate, setSortByDate] = useState(null); // null means no sorting

  useEffect(() => {
    const storedEpisodes = getEpisodesFromLocalStorage();
    const sortedEpisodes = sortEpisodesByEpisodeId([...storedEpisodes]);
    setEpisodes(sortedEpisodes);
    setLoading(false);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const toggleFavourite = (episode) => {
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

  useEffect(() => {
    // Log episodeIds of favourite episodes after any sorting
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
          <div className="custom-button sortDate"  onClick={handleSortDate}>
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

