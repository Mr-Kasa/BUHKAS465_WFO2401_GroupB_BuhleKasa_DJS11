import React, { useState, useEffect } from 'react';
import './Favourite.css'

const getEpisodesFromLocalStorage = () => {
  const episodes = localStorage.getItem('episodes');
  return episodes ? JSON.parse(episodes) : [];
};

const Favourites = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log('Favourites clicked');
        console.log('Updated Episode:', updatedEpisode);
        return updatedEpisode;
      }
      return ep;
    });

    setEpisodes(updatedEpisodes);
    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));
  };

  useEffect(() => {
    const favouriteEpisodeTitles = episodes
      .filter(ep => ep.isFavourite)
      .map(ep => ep.episodeTitle);

    console.log('Favourite Episode Titles on Page Load:', favouriteEpisodeTitles);
  }, [episodes]);

  const favouriteEpisodes = episodes.filter(ep => ep.isFavourite);

  return (
    <div className="favourites-container">
      <div className="favourites-header">
        <h1>Favourite Episodes</h1>
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
