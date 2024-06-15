import React from 'react';
import { useLocation } from 'react-router-dom';

interface Episode {
  title: string;
  description: string;
  episode: number;
  file: string;
}

interface Season {
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}

const EpisodePreview: React.FC = () => {
  const location = useLocation();
  const { season } = location.state as { season: Season };

  return (
    <div>
      <h1>{season.title}</h1>
      <img src={season.image} alt={season.title} />
      <ul>
        {season.episodes.map((episode) => (
          <li key={episode.episode}>
            <h3>{episode.title}</h3>
            <p>{episode.description}</p>
            <audio controls>
              <source src={episode.file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodePreview;


