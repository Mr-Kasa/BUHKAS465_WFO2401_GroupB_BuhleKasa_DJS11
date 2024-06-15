import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

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

const SeasonPreview: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { seasons } = location.state as { seasons: Season[] };

  return (
    <div>
      <h1>Seasons</h1>
      {seasons.map((season) => (
        <div key={season.season}>
          <h2>
            <Link to={`/show/${id}/seasons/${season.season}/episodes`} state={{ season }}>
              {season.title}
            </Link>
          </h2>
          <img src={season.image} alt={season.title} />
        </div>
      ))}
    </div>
  );
};

export default SeasonPreview;




