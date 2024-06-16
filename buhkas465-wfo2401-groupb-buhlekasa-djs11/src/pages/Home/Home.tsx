import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllPodcasts, sortByTitleAlphabetically, useFetchAndSetFavouriteEpisodes } from '../../UtilFunctions';
import './Home.css';

interface Podcast {
  id: string;
  title: string;
  image: string;
  seasons: number;
}

const Home: React.FC = () => {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [displayCount, setDisplayCount] = useState(20);

  // Call your custom hook here
  const favouriteEpisodes = useFetchAndSetFavouriteEpisodes();

  const loadAllPodcasts = async () => {
    setIsInitialLoading(true);
    setError(null);

    try {
      const fetchedPodcasts = await fetchAllPodcasts();
      if (fetchedPodcasts && fetchedPodcasts.length > 0) {
        const sortedPodcasts = sortByTitleAlphabetically(fetchedPodcasts);
        setAllPodcasts(sortedPodcasts);
        setDisplayedPodcasts(sortedPodcasts.slice(0, displayCount));
      } else {
        throw new Error('No podcasts found');
      }
    } catch (error: any) {
      console.error('Error fetching podcasts:', error);
      setError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAllPodcasts();
  }, []);

  useEffect(() => {
    setDisplayedPodcasts(allPodcasts.slice(0, displayCount));
  }, [displayCount, allPodcasts]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
      return;
    }
    setIsLoading(true);
    setDisplayCount((prevCount) => prevCount + 20);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setDisplayedPodcasts(allPodcasts.slice(0, displayCount));
      setIsLoading(false);
    }
  }, [displayCount, isLoading, allPodcasts]);

  const podcastElements = displayedPodcasts.map((podcast: Podcast) => (
    <div key={podcast.id} className="podcast-tile">
      <Link to={`/show/${podcast.id}`}>
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
        {isInitialLoading ? (
          <p className='isLoading'>Loading...</p>
        ) : (
          <>
            {podcastElements}
            {isLoading && <p className='isLoading'>Loading more podcasts...</p>}
            {error && <h2 className='isLoading'>Please check your internet connection.</h2>}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
