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

const Favourites = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByTitle, setSortByTitle] = useState('AZ');
  const [sortByDate, setSortByDate] = useState(null);

  useEffect(() => {
    const storedEpisodes = getEpisodesFromLocalStorage();
    setEpisodes(storedEpisodes);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('Episodes updated:', episodes);
  }, [episodes]);

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
    if (episodes.length > 0) {
      console.log('Sorting by title:', sortByTitle);
      if (sortByTitle === 'AZ') {
        const sortedEpisodes = sortEpisodesByTitleZA([...episodes]); // Create a copy of episodes
        setEpisodes(sortedEpisodes);
        setSortByTitle('ZA');
      } else {
        const sortedEpisodes = sortEpisodesByTitleAZ([...episodes]); // Create a copy of episodes
        setEpisodes(sortedEpisodes);
        setSortByTitle('AZ');
      }
      setSortByDate(null); // Deactivate date sorting
    }
  };

  const handleSortDate = () => {
    if (episodes.length > 0) {
      console.log('Sorting by date:', sortByDate);
      console.log('Episodes before sorting by date:', episodes);
      if (sortByDate === 'Newest') {
        const sortedEpisodes = sortEpisodesByDateOldest([...episodes]); // Create a copy of episodes
        console.log('Sorted episodes (Oldest):', sortedEpisodes);
        setEpisodes(sortedEpisodes);
        setSortByDate('Oldest');
      } else {
        const sortedEpisodes = sortEpisodesByDateNewest([...episodes]); // Create a copy of episodes
        console.log('Sorted episodes (Newest):', sortedEpisodes);
        setEpisodes(sortedEpisodes);
        setSortByDate('Newest');
      }
      setSortByTitle(null); // Deactivate title sorting
    }
  };

  const favouriteEpisodes = episodes.filter(ep => ep.isFavourite);

  console.log('Render: favouriteEpisodes', favouriteEpisodes);

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <h1>Favourite Episodes</h1>
        <div className="sort-buttons">
          <button onClick={handleSortTitle}>
            {sortByTitle === 'AZ' ? 'Sort A-Z' : 'Sort Z-A'}
          </button>
          <button onClick={handleSortDate}>
            {sortByDate === 'Newest' ? 'Sort Newest-Oldest' : 'Sort Oldest-Newest'}
          </button>
        </div>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : favouriteEpisodes.length > 0 ? (
        <div className="favourites-list">
          {favouriteEpisodes.map((storedEpisode) => (
            <div className="favourites-item" key={storedEpisode.episodeId}>
              <img src={storedEpisode.seasonImage} alt={storedEpisode.episodeTitle} />
              <h2>{storedEpisode.episodeTitle}</h2>
              <p>{`Show: ${storedEpisode.showTitle}`}</p>
              <p>{`Episode: ${getEpisodeNumber(storedEpisode.episodeId)}`}</p>
              <p>{`Season: ${getSeasonNumber(storedEpisode.episodeId)}`}</p>
              <p>{`Favourited On: ${storedEpisode.dateFavourited}`}</p>
              <button className="favourite-button" onClick={() => toggleFavourite(storedEpisode)}>
                {storedEpisode.isFavourite ? '❤️' : '♡'}
              </button>
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
