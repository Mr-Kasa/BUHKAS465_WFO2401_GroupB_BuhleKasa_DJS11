import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import "./SeasonPreview.css";

interface Episode {
  title: string;
  description: string;
  episode: number;
  file: string;
}

interface Season {
  showTitle: string;
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}

const SeasonPreview: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { seasons, showTitle } = location.state as { seasons: Season[], showTitle: string };

  return (
    <div>
      <h1>{showTitle}</h1>
      <h2>Seasons</h2>
      <div className='seasonsContainer'>
      {seasons.map((season) => (
        <div key={season.season} className='seasonBackground'>
          <h3>
            <Link to={`/show/${id}/seasons/${season.season}/episodes`} state={{ season }}>
              {season.title}
            </Link>
          </h3>
          <img src={season.image} alt={season.title} />
          <p>{season.episodes.length} episodes</p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default SeasonPreview;





