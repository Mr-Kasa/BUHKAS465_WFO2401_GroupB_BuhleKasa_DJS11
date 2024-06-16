import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { EpisodeContext } from '../components/Player/EpisodeContext';
import { Episode } from '../types';

const EpisodePreview: React.FC = () => {
  const location = useLocation();
  const { season } = location.state as { season: Season };
  const { setCurrentEpisode } = useContext(EpisodeContext);

  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  return (
    <div>
      <h1>{season.title}</h1>
      <img src={season.image} alt={season.title} />
      <ul>
        {season.episodes.map((episode) => (
          <li key={episode.episode}>
            <h3>{episode.title}</h3>
            <p>{episode.description}</p>
            <button onClick={() => playEpisode(episode)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodePreview;
