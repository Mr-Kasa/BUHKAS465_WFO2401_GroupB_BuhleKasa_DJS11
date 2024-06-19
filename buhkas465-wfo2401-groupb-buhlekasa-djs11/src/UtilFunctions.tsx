


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






export async function fetchShowsByGenre(genreId: string): Promise<Podcast[]> {
  const baseUrl = 'https://podcast-api.netlify.app';
  const url = genreId ? `${baseUrl}/genre/${genreId}` : baseUrl;

  console.log(`${genreId} in Utilfunctions`);
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    if (genreId && data.hasOwnProperty('shows')) {
      const showIds = data.shows;  // Assuming 'shows' is an array of show IDs
      console.log('Show IDs:', showIds);

      const showDetails = await fetchShowDetails(showIds);
      console.log('Show details:', showDetails);

      return showDetails;
    } else if (Array.isArray(data)) {
      // If no genreId is provided, return the base data which is the list of shows
      return data.map((show: any) => ({
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
    throw error;  // Re-throw the error after logging it
  }
}

async function fetchShowDetails(showIds: string[]): Promise<Podcast[]> {
  try {
    const showDetails = await Promise.all(
      showIds.map(async (id) => {
        const url = `https://podcast-api.netlify.app/id/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch show with id ${id}`);
        }

        const showData = await response.json();
        console.log(`Fetched show data for id ${id}:`, showData);

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

export function formatDateTime(dateTimeString) {
  console.log(dateTimeString)
  // Check if the string is empty or invalid
  if (!dateTimeString || !Date.parse(dateTimeString)) {
    console.log("date is an empty string")
    return ""; // Return an empty string if invalid
  }

  const date = new Date(dateTimeString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, '0');

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12; // Convert to 12-hour format (12 for midnight)

  return `${day}-${month}-${year} ${adjustedHours}:${minutes} ${ampm}`;
}



export const sortPodcastsByTitleAZ = (podcasts: Podcast[]) => {
  return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
};

export const sortPodcastsByTitleZA = (podcasts: Podcast[]) => {
  return [...podcasts].sort((a, b) => b.title.localeCompare(a.title));
};

export const sortPodcastsByDateOldest = (podcasts: Podcast[]) => {
  return [...podcasts].sort((a, b) => new Date(a.update).getTime() - new Date(b.update).getTime());
};

export const sortPodcastsByDateNewest = (podcasts: Podcast[]) => {
  return [...podcasts].sort((a, b) => new Date(b.update).getTime() - new Date(a.update).getTime());
};















export interface Podcast {
  id: string;
  title: string;
  image: string;
  seasons: number;
}

export const sortByTitleAlphabetically = (podcasts: Podcast[]): Podcast[] => {
  return podcasts.filter(podcast => podcast.title).sort((a, b) => {
    if (a.title && b.title) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return 0;
  });
};



export const storePlayedEpisode = (episodeTitle, episodeDescription) => {
  // Received parameters can be removed as they don't provide essential information during execution

  const findEpisodeId = (episodeTitle, episodeDescription) => {
    try {
      // Retrieve episodes array from local storage
      const episodes = JSON.parse(localStorage.getItem('episodes')) || [];

      if (!episodes || episodes.length === 0) {
        console.error("No episodes found in local storage.");
        return null;
      }

      let foundEpisodeId = null;

      // Loop through each episode to find the matching one
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

  const now = new Date(); // Get current date and time

  const playedEpisode = {
    episodeId: episodeId,
    episodeTitle: episodeTitle,
    playedAt: now.toISOString() // Store timestamp in ISO 8601 format
  };

  try {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(playedEpisode);
    localStorage.setItem('history', JSON.stringify(history));
    // Success message can be removed if desired for a truly clean console
    // console.log('Played episode stored successfully in history:', playedEpisode);
  } catch (error) {
    console.error('Error storing played episode in history:', error);
  }
  
};






















import { useState, useEffect } from 'react';

interface Episode {
    id: string;
    title: string;
    image: string;
    episodeId: string;
    episodeTitle: string;
    showId: string;
    showTitle: string;
    showImage: string;
    seasonImage: string;
    file: string;
    isFavourite: boolean;
    description: string; // Added description field
}

export const useFetchAndSetFavouriteEpisodes = (): Episode[] => {
  const [favouriteEpisodes, setFavouriteEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const showdata: Episode[] = data.map((show: any) => ({
          id: show.id,
          title: show.title,
          image: show.image,
        }));

        const favourites = JSON.parse(localStorage.getItem('Shows')) || [];
        if (favourites.length === 0) {
          localStorage.setItem('Shows', JSON.stringify(showdata));
        }

        await Promise.all(showdata.map((show: Episode) => fetchDetailedShowData(show.id)));
      } catch (error) {
        console.error('Failed to fetch show data:', error);
      }
    };

    const fetchDetailedShowData = async (showId: string) => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const favourites = JSON.parse(localStorage.getItem('Shows')) || [];
        const show = favourites.find((fav: any) => fav.id === showId);

        if (!show) {
          console.error('Show not found in Shows');
          return;
        }

        const episodesData = data.seasons.flatMap((season: any) =>
          season.episodes.map((episode: any) => ({
            showId: showId,
            episodeId: `episode-${showId}-${season.season}-${episode.episode}`,
            episodeTitle: episode.title,
            showTitle: show.title,
            showImage: show.image,
            seasonImage: season.image,
            file: episode.file,
            isFavourite: false,
            description: episode.description, 
            dateFavourited:"",
          }))
        );

        const storedEpisodes = JSON.parse(localStorage.getItem('episodes')) || [];
        const updatedEpisodes = [...storedEpisodes, ...episodesData];

        const uniqueEpisodes = Array.from(new Set(updatedEpisodes.map((e: Episode) => e.episodeId)))
          .map((id: string) => updatedEpisodes.find((e: Episode) => e.episodeId === id));

        // Update description in existing episodes (optional)
        const episodesWithDescriptions = uniqueEpisodes.map((episode) => {
          const storedEpisode = storedEpisodes.find((e) => e.episodeId === episode.episodeId);
          return storedEpisode?.description ? episode : { ...episode, description: episode.description };
        });

        localStorage.setItem('episodes', JSON.stringify(episodesWithDescriptions)); // Store episodes with descriptions

        const favouriteEpisodesFiltered = uniqueEpisodes.filter((episode: Episode) => episode.isFavourite);

        setFavouriteEpisodes(favouriteEpisodesFiltered);
      } catch (error) {
        console.error('Failed to fetch detailed show data:', error);
      }
    };

    fetchData();
  }, []);

  return favouriteEpisodes;
};
