import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPodcasts, sortByTitleAlphabetically } from '../../UtilFunctions';

interface Podcast {
  id: string;
  title: string;
  image: string; // Updated to match the fetched data's property name
  seasons: number;
}

const Home: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPodcasts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedPodcasts = await fetchPodcasts();
        if (fetchedPodcasts && fetchedPodcasts.length > 0) {
          const sortedPodcasts = sortByTitleAlphabetically(fetchedPodcasts);
          setPodcasts(sortedPodcasts);
        } else {
          throw new Error('No podcasts found');
        }
      } catch (error: any) {
        console.error('Error fetching podcasts:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getPodcasts();
  }, []);

  const podcastElements = podcasts?.map((podcast: Podcast) => (
    <div key={podcast.id} className="podcast-tile">
      <Link to={`/Home/${podcast.id}`}>
        <img src={podcast.image} alt={podcast.title} />
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
        {isLoading ? (
          <p>Loading podcasts...</p>
        ) : error ? (
          <p>Error fetching podcasts: {error.message}</p>
        ) : (
          podcastElements
        )}
      </div>
    </div>
  );
};

export default Home;
