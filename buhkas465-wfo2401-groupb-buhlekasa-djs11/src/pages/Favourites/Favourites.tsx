import React, { useState, useEffect } from 'react';
import './Favourite.css';
import {
  sortPodcastsByTitleAZ,
  sortPodcastsByTitleZA,
  sortPodcastsByDateOldest,
  sortPodcastsByDateNewest,
} from '../../UtilFunctions'

const getEpisodesFromLocalStorage = () => {
  const episodes = localStorage.getItem('episodes');
  return episodes ? JSON.parse(episodes) : [];
};

const Favourites = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(''); // State to track current sorting method

  useEffect(() => {
    setTimeout(() => {
      const storedEpisodes = getEpisodesFromLocalStorage();
      setEpisodes(storedEpisodes);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFavourite = (episode) => {
    const updatedEpisodes = episodes.map((ep) => {
      if (ep.episodeId === episode.episodeId) {
        const updatedEpisode = { ...ep, isFavourite: !ep.isFavourite };
        return updatedEpisode;
      }
      return ep;
    });

    setEpisodes(updatedEpisodes);
    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));
  };

  const handleSortAZ = () => {
    if (sortBy !== 'AZ') {
      const sortedEpisodes = sortPodcastsByTitleAZ(episodes);
      setEpisodes(sortedEpisodes);
      setSortBy('AZ');
    } else {
      const sortedEpisodes = sortPodcastsByTitleZA(episodes);
      setEpisodes(sortedEpisodes);
      setSortBy('ZA');
    }
  };

  const handleSortNewest = () => {
    if (sortBy !== 'Newest') {
      const sortedEpisodes = sortPodcastsByDateNewest(episodes);
      setEpisodes(sortedEpisodes);
      setSortBy('Newest');
    } else {
      const sortedEpisodes = sortPodcastsByDateOldest(episodes);
      setEpisodes(sortedEpisodes);
      setSortBy('Oldest');
    }
  };

  const favouriteEpisodes = episodes.filter(ep => ep.isFavourite);

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <h1>Favourite Episodes</h1>
        <div className="sort-buttons">
          <button onClick={handleSortAZ}>
            {sortBy === 'AZ' ? 'Sort Z-A' : 'Sort A-Z'}
          </button>
          <button onClick={handleSortNewest}>
            {sortBy === 'Newest' ? 'Sort Oldest-Newest' : 'Sort Newest-Oldest'}
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
              <button className="favourite-button" onClick={() => toggleFavourite(storedEpisode)}>
                {storedEpisode.isFavourite ? 'Unfavourite' : 'Favourite'}
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
