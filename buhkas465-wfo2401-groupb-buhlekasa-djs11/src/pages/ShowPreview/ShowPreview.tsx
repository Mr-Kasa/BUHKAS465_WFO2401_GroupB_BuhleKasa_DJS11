import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./ShowPreview.css";

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

interface Podcast {
  id: string;
  title: string;
  description: string;
  seasons: Season[];
}

const ShowPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [podcast, setPodcast] = useState<Podcast | null>(null);

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch podcast details');
        }
        const data = await response.json();
        setPodcast(data);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  if (!podcast) {
    return <div>Loading...</div>;
  }

  const seasonsWithEpisodeCount = podcast.seasons.map(season => ({
    ...season,
    numberOfEpisodes: season.episodes.length
  }));

  return (
    <div className='SeasonTiles'>
      <img className='seasonImg' src={podcast.seasons[0]?.image || ''} alt={podcast.title} />
      <div className='ShowInfo'>
        <h1>{podcast.title}</h1>
        <p>Description: {podcast.description}</p>
        <div>
          <h3>Seasons: {podcast.seasons.length}</h3>
          <Link className='GoToSeasons' to={`/show/${id}/seasons`} state={{ seasons: seasonsWithEpisodeCount, showTitle: podcast.title }}>
            <h2>Go to seasons</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowPreview;








