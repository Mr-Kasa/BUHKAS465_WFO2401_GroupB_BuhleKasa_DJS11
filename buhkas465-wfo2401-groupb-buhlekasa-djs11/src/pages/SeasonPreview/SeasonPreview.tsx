import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import "./SeasonPreview.css";

/**
 * Interface for an Episode object.
 */
interface Episode {
  title: string;
  description: string;
  episode: number;
  file: string;
}

/**
 * Interface for a Season object.
 */
interface Season {
  showTitle: string;
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}

/**
 * SeasonPreview component displaying details of seasons for a show.
 * 
 * @returns {JSX.Element} The SeasonPreview component.
 */
const SeasonPreview: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { seasons, showTitle } = location.state as { seasons: Season[], showTitle: string };

  return (
    <div className='seasons'>
      <h1>{showTitle}</h1>
      <h2>Seasons</h2>
      <div className='seasonsContainer'>
        {seasons.map((season) => (
          <Link key={season.season} to={`/show/${id}/seasons/${season.season}/episodes`} state={{ season }}>
            <div className='seasonBackground'>
              <h3>{season.title}</h3>
              <img className='seasonImage' src={season.image} alt={season.title} />
              <p>{season.episodes.length} episodes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeasonPreview;






