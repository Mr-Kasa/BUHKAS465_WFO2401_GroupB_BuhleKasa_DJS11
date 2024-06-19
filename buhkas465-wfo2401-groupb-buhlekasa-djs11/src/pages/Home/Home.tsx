import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShowsByGenre, useFetchAndSetFavouriteEpisodes, formatDateTime, sortPodcastsByTitleAZ, sortPodcastsByTitleZA } from '../../UtilFunctions';
import { Genres } from '../../genres';

import './Home.css';

interface Podcast {
  id: string;
  title: string;
  imageUrl: string;
  seasons: number;
  genres: number[];
  description?: string;
  update: string;
}

const Home: React.FC = () => {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'AZ' | 'ZA'>('AZ');

  const loadPodcasts = async (genreId: number | null = null) => {
    setIsInitialLoading(true);
    setError(null);

    try {
      console.log('Fetching podcasts for genre ID:', genreId);
      const fetchedShows = await fetchShowsByGenre(genreId !== null ? genreId.toString() : '');
      console.log('Fetched shows:', fetchedShows);
      setAllPodcasts(fetchedShows);
      setDisplayedPodcasts(sortPodcastsByTitleAZ(fetchedShows));
      console.log(`Number of displayed items: ${fetchedShows.length}`);
    } catch (error: any) {
      console.error('Error fetching podcasts:', error);
      setError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  useEffect(() => {
    if (selectedGenre !== null) {
      const filteredPodcasts = allPodcasts.filter(podcast => podcast.genres.includes(selectedGenre));
      setDisplayedPodcasts(sortOrder === 'AZ' ? sortPodcastsByTitleAZ(filteredPodcasts) : sortPodcastsByTitleZA(filteredPodcasts));
      console.log(`Number of displayed items after genre filter: ${filteredPodcasts.length}`);
    } else {
      setDisplayedPodcasts(sortOrder === 'AZ' ? sortPodcastsByTitleAZ(allPodcasts) : sortPodcastsByTitleZA(allPodcasts));
      console.log(`Number of displayed items (all genres): ${allPodcasts.length}`);
    }
  }, [selectedGenre, allPodcasts, sortOrder]);

  useEffect(() => {
    console.log(`Number of displayed items: ${displayedPodcasts.length}`);
  }, [displayedPodcasts]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value ? Number(e.target.value) : null;
    console.log('Selected genre ID:', genreId);
    setSelectedGenre(genreId);
  };

  const handleSortToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'AZ' ? 'ZA' : 'AZ'));
  };

  const getGenreNames = (genreIds: number[]) => {
    const genres = genreIds.map((id) => Genres[id]);
    if (genres.length === 1) {
      return `Genre: ${genres[0]}`;
    } else if (genres.length > 1) {
      return `Genres: ${genres.join(', ')}`;
    } else {
      return '';
    }
  };

  const podcastElements = displayedPodcasts.map((podcast: Podcast) => (
    <div key={podcast.id} className="podcast-tile">
      <Link to={`/show/${podcast.id}`}>
        <img src={podcast.imageUrl} alt={podcast.title} />
        <div className="podcast-info">
          <h3>{podcast.title}</h3>
          <p>Seasons: {podcast.seasons}</p>
          <p>Last updated: {formatDateTime(podcast.update)}</p>
          <p>{getGenreNames(podcast.genres)}</p>
          {podcast.description && <p>{podcast.description}</p>}
        </div>
      </Link>
    </div>
  ));

  useFetchAndSetFavouriteEpisodes();

  return (
    <div className="HomePagePodcasts">
      <div className="controls">
        <div className="genreFilter">
          <label htmlFor="genreSelect">Filter by Genre: </label>
          <select
            id="genreSelect"
            onChange={handleGenreChange}
            value={selectedGenre || ''}
          >
            <option value="">All</option>
            {Object.entries(Genres).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <button className='sortAZ' onClick={handleSortToggle}>
          Sort {sortOrder === 'AZ' ? 'Z-A' : 'A-Z'}
        </button>
      </div>
      <div className="podcastList">
        {isInitialLoading ? (
          <p className='isLoading'>Loading...</p>
        ) : (
          <>
            {podcastElements.length > 0 ? podcastElements : <p>No podcasts available for this genre.</p>}
            {error && <h2 className='isLoading'>Please check your internet connection.</h2>}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
