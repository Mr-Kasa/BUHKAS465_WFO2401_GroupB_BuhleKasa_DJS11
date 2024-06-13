import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Podcast {
  id: string;
  title: string;
  imageUrl: string;
  seasons: number;
}

const Home: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPodcasts(data.podcasts);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
       
      }
    };

    fetchPodcasts();
  }, []);

  const podcastElements = podcasts.map((podcast) => (
    <div key={podcast.id} className="podcast-tile">
      <Link to={`/podcasts/${podcast.id}`}> 
        <img src={podcast.imageUrl} alt={podcast.title} /> 
        <div className="podcast-info">
          <h3>{podcast.title}</h3>
          <p>Seasons: {podcast.seasons}</p>
        </div>
      </Link>
    </div>
  ));

  return (
    <div className="HomePagePodcasts">
      <div className="podcastList">
        {podcastElements}
      </div>
    </div>
  );
};

export default Home;
