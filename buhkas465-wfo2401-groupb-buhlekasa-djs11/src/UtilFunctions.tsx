import { useState, useEffect } from 'react';

/**
 * Represents an episode of a podcast.
 * @typedef {Object} Episode
 * @property {string} id - The unique identifier of the episode.
 * @property {string} title - The title of the episode.
 * @property {string} image - The URL to the episode's image.
 * @property {string} episodeId - The unique identifier for the episode (e.g., 'episode-123').
 * @property {string} episodeTitle - The title of the episode.
 * @property {string} showId - The ID of the show to which the episode belongs.
 * @property {string} showTitle - The title of the show.
 * @property {string} showImage - The URL to the show's image.
 * @property {string} seasonImage - The URL to the season's image.
 * @property {string} file - The URL or path to the episode file.
 * @property {boolean} isFavourite - Indicates if the episode is marked as a favorite.
 * @property {string} description - The description of the episode.
 * @property {string} dateFavourited - The date when the episode was favorited.
 */

/**
 * Fetches all podcasts from the API.
 * @returns {Promise<any[]>} Array of podcast data.
 */
export async function fetchAllPodcasts() {
  try {
    const response = await fetch('https://podcast-api.netlify.app');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw new Error('Failed to fetch podcasts. Please try again later.');
  }
}

/**
 * Fetches shows by genre from the API.
 * @param {string} genreId - The ID of the genre to filter shows.
 * @returns {Promise<any[]>} Array of podcast data filtered by genre.
 */
export async function fetchShowsByGenre(genreId) {
  const baseUrl = 'https://podcast-api.netlify.app';
  const url = genreId ? `${baseUrl}/genre/${genreId}` : baseUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (genreId && data.hasOwnProperty('shows')) {
      const showIds = data.shows; // Assuming 'shows' is an array of show IDs
      const showDetails = await fetchShowDetails(showIds);
      return showDetails;
    } else if (Array.isArray(data)) {
      // If no genreId is provided, return the base data which is the list of shows
      return data.map((show) => ({
        id: show.id,
        title: show.title,
        imageUrl: show.image, // Ensure this matches the correct field from the base data response
        seasons: show.seasons,
        genres: show.genres,
        update: show.updated, // Ensure this matches the correct field from the base data response
      }));
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching shows by genre:', error);
    throw error; // Re-throw the error after logging it
  }
}

/**
 * Fetches detailed information for multiple shows.
 * @param {string[]} showIds - Array of show IDs to fetch details for.
 * @returns {Promise<any[]>} Array of podcast details for each show ID.
 */
async function fetchShowDetails(showIds) {
  try {
    const showDetails = await Promise.all(
      showIds.map(async (id) => {
        const url = `https://podcast-api.netlify.app/id/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch show with id ${id}`);
        }
        const showData = await response.json();
        return {
          id: showData.id,
          title: showData.title,
          imageUrl: showData.seasons[0].image, // Assuming first season image
          seasons: showData.seasons.length,
          genres: showData.genres,
          update: showData.updated,
        };
      })
    );
    return showDetails;
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
}

/**
 * Formats a date-time string into a readable format.
 * @param {string} dateTimeString - The date-time string to format.
 * @returns {string} Formatted date-time string (e.g., '01-01-2024 12:00 PM').
 */
export function formatDateTime(dateTimeString) {
  if (!dateTimeString || !Date.parse(dateTimeString)) {
    return "";
  }

  const date = new Date(dateTimeString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;

  return `${day}-${month}-${year} ${adjustedHours}:${minutes} ${ampm}`;
}

/**
 * Sorts podcasts alphabetically by title in ascending order.
 * @param {Podcast[]} podcasts - Array of podcasts to sort.
 * @returns {Podcast[]} Sorted array of podcasts.
 */
export const sortPodcastsByTitleAZ = (podcasts) => {
  return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Sorts podcasts alphabetically by title in descending order.
 * @param {Podcast[]} podcasts - Array of podcasts to sort.
 * @returns {Podcast[]} Sorted array of podcasts.
 */
export const sortPodcastsByTitleZA = (podcasts) => {
  return [...podcasts].sort((a, b) => b.title.localeCompare(a.title));
};

/**
 * Sorts podcasts by date from oldest to newest.
 * @param {Podcast[]} podcasts - Array of podcasts to sort.
 * @returns {Podcast[]} Sorted array of podcasts.
 */
export const sortPodcastsByDateOldest = (podcasts) => {
  return [...podcasts].sort((a, b) => new Date(a.update).getTime() - new Date(b.update).getTime());
};

/**
 * Sorts podcasts by date from newest to oldest.
 * @param {Podcast[]} podcasts - Array of podcasts to sort.
 * @returns {Podcast[]} Sorted array of podcasts.
 */
export const sortPodcastsByDateNewest = (podcasts) => {
  return [...podcasts].sort((a, b) => new Date(b.update).getTime() - new Date(a.update).getTime());
};

/**
 * Interface representing a podcast.
 * @interface Podcast
 * @property {string} id - The unique identifier of the podcast.
 * @property {string} title - The title of the podcast.
 * @property {string} image - The URL to the podcast's image.
 * @property {number} seasons - The number of seasons the podcast has.
 */

/**
 * Sorts podcasts by title alphabetically (case-insensitive).
 * @param {Podcast[]} podcasts - Array of podcasts to sort.
 * @returns {Podcast[]} Sorted array of podcasts.
 */
export const sortByTitleAlphabetically = (podcasts) => {
  return podcasts.filter(podcast => podcast.title).sort((a, b) => {
    if (a.title && b.title) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return 0;
  });
};

/**
 * Stores information about a played episode in local storage.
 * @param {string} episodeTitle - The title of the episode played.
 * @param {string} episodeDescription - The description of the episode played.
 */
export const storePlayedEpisode = (episodeTitle, episodeDescription) => {
  const findEpisodeId = (episodeTitle, episodeDescription) => {
    try {
      const episodes = JSON.parse(localStorage.getItem('episodes')) || [];
      if (!episodes || episodes.length === 0) {
        console.error("No episodes found in local storage.");
        return null;
      }
      let foundEpisodeId = null;
      episodes.forEach(episode => {
        if (episode.description === episodeDescription) {
          foundEpisodeId = episode.episodeId || null;
        }
      });
      if (!foundEpisodeId) {
        console.error('No episode found with the given title and description.');
        return null;
      }
      return foundEpisodeId;
    } catch (error) {
      console.error('Error finding episode ID:', error);
      return null;
    }
  };

  const episodeId = findEpisodeId(episodeTitle, episodeDescription);

  if (!episodeId) {
    console.error('Invalid episodeId for the given episodeTitle and episodeDescription.');
    return;
  }

  const now = new Date();
  const playedEpisode = {
    episodeId: episodeId,
    episodeTitle: episodeTitle,
    playedAt: now.toISOString()
  };

  try {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(playedEpisode);
    localStorage.setItem('history', JSON.stringify(history));
  } catch (error) {
    console.error('Error storing played episodein history:', error);
  }
};

/**
 * Sorts episodes alphabetically by title in ascending order.
 * @param {Episode[]} episodes - Array of episodes to sort.
 * @returns {Episode[]} Sorted array of episodes.
 */
export const sortEpisodesByTitleAZ = (episodes) => {
  return episodes.sort((a, b) => a.episodeTitle.localeCompare(b.episodeTitle));
};

/**
 * Sorts episodes alphabetically by title in descending order.
 * @param {Episode[]} episodes - Array of episodes to sort.
 * @returns {Episode[]} Sorted array of episodes.
 */
export const sortEpisodesByTitleZA = (episodes) => {
  return episodes.sort((a, b) => b.episodeTitle.localeCompare(a.episodeTitle));
};

/**
 * Parses a date string into a Date object using date-fns parse function.
 * @param {string} dateString - The date string to parse.
 * @returns {Date | null} Parsed Date object or null if parsing fails.
 */
const parseDate = (dateString) => {
  if (!dateString) return null; // Handle empty string
  try {
    return parse(dateString, 'MMMM d, yyyy \'at\' h:mm a', new Date());
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null; // Return null for invalid date
  }
};

/**
 * Compares two dates for sorting purposes.
 * @param {Date | null} dateA - The first date to compare.
 * @param {Date | null} dateB - The second date to compare.
 * @param {boolean} ascending - Flag indicating ascending (true) or descending (false) order.
 * @returns {number} Comparison result.
 */
const compareDates = (dateA, dateB, ascending = true) => {
  if (!dateA && !dateB) return 0;
  if (!dateA) return ascending ? -1 : 1;
  if (!dateB) return ascending ? 1 : -1;
  return ascending ? dateA - dateB : dateB - dateA;
};

/**
 * Sorts episodes by date from oldest to newest based on the 'dateFavourited' field.
 * @param {Episode[]} episodes - Array of episodes to sort.
 * @returns {Episode[]} Sorted array of episodes.
 */
export const sortEpisodesByDateOldest = (episodes) => {
  console.log('Sorting by Date Oldest - Input Episodes:', episodes);
  const sorted = episodes.sort((a, b) => {
    const dateA = parseDate(a.dateFavourited);
    const dateB = parseDate(b.dateFavourited);
    console.log(`Parsing Dates - A: ${a.dateFavourited} (${dateA}), B: ${b.dateFavourited} (${dateB})`);
    return compareDates(dateA, dateB, true);
  });
  console.log('Sorted Episodes (Oldest):', sorted);
  return sorted;
};

/**
 * Sorts episodes by date from newest to oldest based on the 'dateFavourited' field.
 * @param {Episode[]} episodes - Array of episodes to sort.
 * @returns {Episode[]} Sorted array of episodes.
 */
export const sortEpisodesByDateNewest = (episodes) => {
  console.log('Sorting by Date Newest - Input Episodes:', episodes);
  const sorted = episodes.sort((a, b) => {
    const dateA = parseDate(a.dateFavourited);
    const dateB = parseDate(b.dateFavourited);
    console.log(`Parsing Dates - A: ${a.dateFavourited} (${dateA}), B: ${b.dateFavourited} (${dateB})`);
    return compareDates(dateA, dateB, false);
  });
  console.log('Sorted Episodes (Newest):', sorted);
  return sorted;
};

/**
 * Retrieves the current date and time in a formatted string.
 * @returns {string} Current date and time formatted as 'Month Day, Year HH:MM AM/PM'.
 */
export const getCurrentDateTime = () => {
  return new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

