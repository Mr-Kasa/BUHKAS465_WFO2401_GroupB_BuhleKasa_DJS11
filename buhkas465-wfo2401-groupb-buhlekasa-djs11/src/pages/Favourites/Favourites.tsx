import React, { useState, useEffect } from 'react';

// Function to fetch episodes from local storage
const getEpisodesFromLocalStorage = () => {
  const episodes = localStorage.getItem('episodes');
  return episodes ? JSON.parse(episodes) : [];
};

const Favourites = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      const storedEpisodes = getEpisodesFromLocalStorage();
      setEpisodes(storedEpisodes);
      setLoading(false);
    }, 1000); // Simulate a delay of 1 second
  }, []);

  // Toggle favorite status and update local storage
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

  // Log favorite episode titles on page load
  useEffect(() => {
    const favouriteEpisodeTitles = episodes
      .filter(ep => ep.isFavourite)
      .map(ep => ep.episodeTitle);

    console.log('Favourite Episode Titles on Page Load:', favouriteEpisodeTitles);
  }, [episodes]);

  // Filter favorite episodes
  const favouriteEpisodes = episodes.filter(ep => ep.isFavourite);

  return (
    <div>
      <h1>Favourite Episodes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : favouriteEpisodes.length > 0 ? (
        favouriteEpisodes.map((storedEpisode) => (
          <div key={storedEpisode.episodeId} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <img src={storedEpisode.seasonImage} alt={storedEpisode.episodeTitle} style={{ width: '100px', height: '100px' }} />
            <h2>{storedEpisode.episodeTitle}</h2>
            <button onClick={() => toggleFavourite(storedEpisode)}>
              {storedEpisode.isFavourite ? 'Unfavourite' : 'Favourite'}
            </button>
          </div>
        ))
      ) : (
        <p>No favourite episodes found.</p>
      )}
    </div>
  );
};

export default Favourites;

