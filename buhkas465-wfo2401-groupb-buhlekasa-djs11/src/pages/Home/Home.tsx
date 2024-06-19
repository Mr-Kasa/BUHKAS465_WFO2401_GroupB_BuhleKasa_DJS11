import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShowsByGenre, useFetchAndSetFavouriteEpisodes, formatDateTime, sortPodcastsByTitleAZ, sortPodcastsByTitleZA, sortPodcastsByDateOldest, sortPodcastsByDateNewest } from '../../UtilFunctions';
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
  const [titleSortOrder, setTitleSortOrder] = useState<'AZ' | 'ZA'>('AZ');
  const [dateSortOrder, setDateSortOrder] = useState<'Oldest' | 'Newest'>('Newest');

  const loadPodcasts = async (genreId: number | null = null) => {
    setIsInitialLoading(true);
    setError(null);

    try {
      console.log('Fetching podcasts for genre ID:', genreId);
      const fetchedShows = await fetchShowsByGenre(genreId !== null ? genreId.toString() : '');
      console.log('Fetched shows:', fetchedShows);

      setAllPodcasts(fetchedShows);
      applyAllFilters(fetchedShows);
    } catch (error: any) {
      console.error('Error fetching podcasts:', error);
      setError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const applyAllFilters = (podcasts: Podcast[]) => {
    let filteredPodcasts = selectedGenre !== null
      ? podcasts.filter(podcast => podcast.genres.includes(selectedGenre))
      : podcasts;

    filteredPodcasts = titleSortOrder === 'AZ'
      ? sortPodcastsByTitleAZ(filteredPodcasts)
      : sortPodcastsByTitleZA(filteredPodcasts);

    filteredPodcasts = dateSortOrder === 'Oldest'
      ? sortPodcastsByDateOldest(filteredPodcasts)
      : sortPodcastsByDateNewest(filteredPodcasts);

    setDisplayedPodcasts(filteredPodcasts);
    console.log(`Number of displayed items after sorting and filtering: ${filteredPodcasts.length}`);
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  useEffect(() => {
    applyAllFilters(allPodcasts);
  }, [selectedGenre, titleSortOrder, dateSortOrder]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value ? Number(e.target.value) : null;
    console.log('Selected genre ID:', genreId);
    setSelectedGenre(genreId);
  };

  const handleTitleSortToggle = () => {
    setTitleSortOrder(prevOrder => (prevOrder === 'AZ' ? 'ZA' : 'AZ'));
  };

  const handleDateSortToggle = () => {
    setDateSortOrder(prevOrder => (prevOrder === 'Oldest' ? 'Newest' : 'Oldest'));
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
        <button className='sortAZ' onClick={handleTitleSortToggle}>
          Sort {titleSortOrder === 'AZ' ? 'Z-A' : 'A-Z'}
        </button>
        <button className='sortDate' onClick={handleDateSortToggle}>
          Sort by Date {dateSortOrder === 'Oldest' ? 'Newest' : 'Oldest'}
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
