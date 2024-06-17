import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EpisodeContext } from '../components/Player/EpisodeContext';
import { Episode, Season } from '../types';

const EpisodePreview: React.FC = () => {
  const location = useLocation();
  const { season } = location.state as { season: Season };
  const { setCurrentEpisode } = useContext(EpisodeContext);

  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    return JSON.parse(localStorage.getItem('episodes')) || [];
  });

  useEffect(() => {
    localStorage.setItem('episodes', JSON.stringify(episodes));
  }, [episodes]);

  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const findEpisodeId = (episodeTitle: string, episodeDescription: string): string | null => {
    console.log('Searching for episode with values:', { episodeTitle, episodeDescription });

    try {
      const episodes = JSON.parse(localStorage.getItem('episodes')) || [];

      if (!episodes || episodes.length === 0) {
        console.error('No episodes found in local storage.');
        return null;
      }

      const matchingEpisode = episodes.find(
        (episode: Episode) =>
          episode.episodeTitle === episodeTitle &&
          episode.description === episodeDescription
      );

      if (matchingEpisode) {
        console.log('Matching episode found:', matchingEpisode);
        return matchingEpisode.episodeId;
      } else {
        console.error('No episode found with the given criteria.');
        return null;
      }
    } catch (error) {
      console.error('Error finding episode ID:', error);
      return null;
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    const episodeId = findEpisodeId(episode.title, episode.description);
    if (episodeId) {
      console.log('Episode ID found:', episodeId);
      // Perform actions with the episode ID, like storing playback history
    }
    playEpisode(episode);  // Play the episode
  };

  const toggleFavourite = (episode: Episode) => {
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
    const currentEpisode = updatedEpisodes.find(ep => ep.episodeId === episode.episodeId);
    console.log('Current Episode:', currentEpisode);
  };

  return (
    <div>
      <h1>{season.title}</h1>
      <img src={season.image} alt={season.title} />
      <ul>
        {season.episodes.map((episode) => {
          const storedEpisode = episodes.find(ep => ep.episodeTitle === episode.title && ep.description === episode.description) || episode;
          return (
            <li key={storedEpisode.episodeId}>
              <h3>{storedEpisode.episodeTitle}</h3>
              <p>{storedEpisode.description}</p>
              <button onClick={() => handleEpisodeClick(storedEpisode)}>Play</button>
              <button onClick={() => toggleFavourite(storedEpisode)}>
                {storedEpisode.isFavourite ? 'Unfavourite' : 'Favourite'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EpisodePreview;

