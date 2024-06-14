import React, { useState, useEffect } from "react";
import { addIsFavouriteProperty, fetchAllPodcasts, sortByTitleAlphabetically } from "../../UtilFunctions";
import { Link } from "react-router-dom";
import "./Favourite.css";

export default function Favourites() {

  interface Podcast {
    id: string;
    title: string;
    image: string;
    seasons: number;
    isFavourite: boolean;
  }

  const Favourite: React.FC = () => {
    const [favouritePodcasts, setFavouritePodcasts] = useState<Podcast[]>([]);
    const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [displayCount, setDisplayCount] = useState(20);

    const loadFavouritePodcasts = async () => {
      setIsInitialLoading(true);
      setError(null);

      try {
        const fetchedPodcasts = await fetchAllPodcasts();
        if (fetchedPodcasts && fetchedPodcasts.length > 0) {
          const podcastsWithFavourites = addIsFavouriteProperty(fetchedPodcasts);
          const favouritePodcasts = podcastsWithFavourites.filter(podcast => podcast.isFavourite);
          const sortedFavouritePodcasts = sortByTitleAlphabetically(favouritePodcasts);
          setFavouritePodcasts(sortedFavouritePodcasts);
          setDisplayedPodcasts(sortedFavouritePodcasts.slice(0, displayCount));
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
      loadFavouritePodcasts();
    }, []);

    useEffect(() => {
      setDisplayedPodcasts(favouritePodcasts.slice(0, displayCount));
    }, [displayCount, favouritePodcasts]);

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
        setDisplayedPodcasts(favouritePodcasts.slice(0, displayCount));
        setIsLoading(false);
      }
    }, [displayCount, isLoading, favouritePodcasts]);

    const toggleFavourite = (id: string) => {
      const updatedPodcasts = favouritePodcasts.map(podcast =>
        podcast.id === id ? { ...podcast, isFavourite: !podcast.isFavourite } : podcast
      );
      setFavouritePodcasts(updatedPodcasts.filter(podcast => podcast.isFavourite));
      updateLocalStorage(id);
    };

    const updateLocalStorage = (id: string) => {
      let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
      if (favourites.includes(id)) {
        favourites = favourites.filter(favId => favId !== id);
      } else {
        favourites.push(id);
      }
      localStorage.setItem('favourites', JSON.stringify(favourites));
    };

    const favouriteElements = displayedPodcasts.map((podcast: Podcast) => (
      <div key={podcast.id} className="podcast-tile">
        <Link to={`/Home/${podcast.id}`}>
          <img src={podcast.image} alt={podcast.title} />
          <div className='podcastInfoContainer'>
            <div className="podcast-info">
              <h3>{podcast.title}</h3>
              <p>Seasons: {podcast.seasons}</p>
            </div>
            <div>
              <h3
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavourite(podcast.id);
                }}
              >
                {podcast.isFavourite ? '❤️' : '♡'}
              </h3>
            </div>
          </div>
        </Link>
      </div>
    ));

    return (
      <div className="podcastList">
        {favouriteElements}
      </div>
    );
  };

  return <Favourite />;
}
