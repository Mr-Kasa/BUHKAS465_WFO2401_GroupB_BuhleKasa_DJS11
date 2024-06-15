import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeasonPreview from './SeasonPreview';

interface Podcast {
  id: string;
  title: string;
  description: string;
  seasons: {
    season: number;
    title: string;
    image: string;
    episodes: {
      title: string;
      description: string;
      episode: number;
      file: string;
    }[];
  }[];
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

  return (
    <div>
      <img src={podcast.seasons[0]?.image || ''} alt={podcast.title} />
      <h1>{podcast.title}</h1>
      <p>Description: {podcast.description}</p>
      <div>
      <Link to={`/shows/${id}/seasons`}>
      <h3>Seasons: {podcast.seasons.length}</h3>
      </Link>
      </div>
    </div>
  );
};

export default ShowPreview;











     {/* {podcast.seasons.map(season => (
          <div key={season.season}>
            <h2>{season.title}</h2>
            <img src={season.image} alt={season.title} />
          </div>
        ))} */}

            {/* {podcast.seasons.map(season => (
          <div key={season.season}>
            <h2>{season.title}</h2>
            <img src={season.image} alt={season.title} />
            <ul>
              {season.episodes.map(episode => (
                <li key={episode.episode}>
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  <audio controls>
                    <source src={episode.file} type="audio/mpeg" />
                  </audio>
                </li>
              ))}
            </ul>
          </div>
        ))} */}