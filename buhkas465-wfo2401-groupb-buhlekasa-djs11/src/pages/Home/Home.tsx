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

/**
 * Home component displaying a list of podcasts based on selected genre, sorting options,
 * and search input.
 * 
 * @returns {JSX.Element} The Home component.
 */
const Home: React.FC = () => {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [titleSortOrder, setTitleSortOrder] = useState<'AZ' | 'ZA' | null>('AZ');
  const [dateSortOrder, setDateSortOrder] = useState<'Oldest' | 'Newest' | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');

  /**
   * Function to load podcasts based on selected genre ID.
   * 
   * @param {number | null} genreId - The ID of the selected genre.
   */
  const loadPodcasts = async (genreId: number | null = null) => {
    setIsInitialLoading(true);
    setError(null);

    try {
      console.log('Fetching podcasts for genre ID:', genreId);
      const fetchedShows = await fetchShowsByGenre(genreId !== null ? genreId.toString() : '');
      console.log('Fetched shows:', fetchedShows);

      setAllPodcasts(fetchedShows);
      // Apply initial sorting on title (AZ)
      applyAllFilters(fetchedShows);
    } catch (error: any) {
      console.error('Error fetching podcasts:', error);
      setError(error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  /**
   * Apply filters (genre, title sort, date sort) to the list of podcasts.
   * 
   * @param {Podcast[]} podcasts - The list of podcasts to filter.
   */
  const applyAllFilters = (podcasts: Podcast[]) => {
    let filteredPodcasts = selectedGenre !== null
      ? podcasts.filter(podcast => podcast.genres.includes(selectedGenre))
      : podcasts;

    if (titleSortOrder) {
      filteredPodcasts = titleSortOrder === 'AZ'
        ? sortPodcastsByTitleAZ(filteredPodcasts)
        : sortPodcastsByTitleZA(filteredPodcasts);
    } else if (dateSortOrder) {
      filteredPodcasts = dateSortOrder === 'Newest'
        ? sortPodcastsByDateNewest(filteredPodcasts)
        : sortPodcastsByDateOldest(filteredPodcasts);
    }

    setDisplayedPodcasts(filteredPodcasts);
    console.log(`Number of displayed items after sorting and filtering: ${filteredPodcasts.length}`);
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  useEffect(() => {
    applyAllFilters(allPodcasts);
  }, [selectedGenre, titleSortOrder, dateSortOrder]);

  /**
   * Event handler for selecting a genre from dropdown.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object.
   */
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value ? Number(e.target.value) : null;
    console.log('Selected genre ID:', genreId);
    setSelectedGenre(genreId);
  };

  /**
   * Toggle function for sorting podcasts by title.
   */
  const handleTitleSortToggle = () => {
    setTitleSortOrder(prevOrder => (prevOrder === 'AZ' ? 'ZA' : 'AZ'));
    setDateSortOrder(null);
  };

  /**
   * Toggle function for sorting podcasts by date.
   */
  const handleDateSortToggle = () => {
    setDateSortOrder(prevOrder => (prevOrder === 'Newest' ? 'Oldest' : 'Newest'));
    setTitleSortOrder(null);
  };

  /**
   * Get genre names based on genre IDs.
   * 
   * @param {number[]} genreIds - Array of genre IDs.
   * @returns {string} The formatted genre names.
   */
  const getGenreNames = (genreIds: number[]): string => {
    const genres = genreIds.map((id) => Genres[id]);
    if (genres.length === 1) {
      return `Genre: ${genres[0]}`;
    } else if (genres.length > 1) {
      return `Genres: ${genres.join(', ')}`;
    } else {
      return '';
    }
  };

  /**
   * Event handler for search input change.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);

    // Filter displayed podcasts based on search input
    const filteredPodcasts = allPodcasts.filter(podcast =>
      podcast.title.toLowerCase().includes(inputValue)
    );
    setDisplayedPodcasts(filteredPodcasts);
  };

  /**
   * Event handler to clear search input and reset displayed podcasts to all.
   */
  const handleClearSearch = () => {
    setSearchInput('');
    setDisplayedPodcasts(allPodcasts);
  };

  /**
   * Map podcasts to JSX elements for rendering.
   */
  const podcastElements = displayedPodcasts.map((podcast: Podcast) => (
    <div key={podcast.id} className="podcast-tile">
      <Link to={`/show/${podcast.id}`}>
        <img className='homeImg' src={podcast.imageUrl} alt={podcast.title} />
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

  useFetchAndSetFavouriteEpisodes(); // Custom hook to fetch and set favourite episodes

  return (
    <div className="HomePagePodcasts">
      <div className="controls">
        <div className='genreFilter'>
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

        <div className="custom-button sortButtonZA" onClick={handleTitleSortToggle}>
          <h2>Sort {titleSortOrder === 'AZ' ? 'Z-A' : 'A-Z'}</h2>
        </div>

        <div className="custom-button sortButtonOldNew" onClick={handleDateSortToggle}>
          <h2>Sort by Date {dateSortOrder === 'Oldest' ? 'Newest' : 'Oldest'}</h2>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Type podcast name for suggestions.."
          value={searchInput}
          onChange={handleSearchInputChange}
          className='Input'
        />
        <div className="custom-button clear-button" onClick={handleClearSearch}>
          <h2>Clear</h2>
        </div>
      </div>

      <div className="podcastList">
        {isInitialLoading ? (
          <p className='isLoading'>Loading...</p>
        ) : (
          <>
            {podcastElements.length > 0 ? podcastElements : <h2 className='isLoading'>No podcasts found.</h2>}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
