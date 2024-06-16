


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





export interface Podcast {
  id: string;
  title: string;
  image: string;
  seasons: number;
}

export function sortByTitleAlphabetically(podcasts: Podcast[]): Podcast[] {
  return podcasts.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}


export const storePlayedEpisode = (episodeTitle, episodeDescription) => {
  console.log("Received parameters:", episodeTitle, episodeDescription);

  const findEpisodeId = (episodeTitle, episodeDescription) => {
    try {
      // Retrieve episodes array from local storage
      const episodes = JSON.parse(localStorage.getItem('episodes')) || [];
      
      if (!episodes || episodes.length === 0) {
        console.error("No episodes found in local storage.");
        return null;
      }

      console.log("Retrieved episodes from local storage:", episodes);

      let foundEpisodeId = null;

      // Loop through each episode to find the matching one
      episodes.forEach(episode => {
        if (episode.description === episodeDescription) {
          console.log('Matching description found for episode:', episode);
        }
        if (episode.episodeTitle === episodeTitle) {
          console.log('Matching title found for episode:', episode);
        }
        if (episode.episodeTitle === episodeTitle && episode.description === episodeDescription) {
          foundEpisodeId = episode.episodeId || null;
          console.log('Matching episode found:', episode);
        }
      });

      // If episode is found, log it and its ID
      if (foundEpisodeId) {
        console.log('Episode found with ID:', foundEpisodeId);
      } else {
        console.error('No episode found with the given title and description.');
      }

      return foundEpisodeId;
    } catch (error) {
      console.error('Error finding episode ID:', error);
      return null;
    }
  };

  // Get the episodeId using findEpisodeId function
  const episodeId = findEpisodeId(episodeTitle, episodeDescription);

  // Ensure episodeId is valid before storing
  if (!episodeId) {
    console.error('Invalid episodeId for the given episodeTitle and episodeDescription.');
    return;
  }

  // Construct the played episode object
  const playedEpisode = {
    episodeId: episodeId,
    episodeTitle: episodeTitle
  };

  try {
    // Get existing history from localStorage
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Add the new episode to the history array
    history.push(playedEpisode);

    // Save the updated history array back to localStorage
    localStorage.setItem('history', JSON.stringify(history));

    console.log('Played episode stored successfully in history:', playedEpisode);
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
                    image: show.image
                }));

                const favourites = JSON.parse(localStorage.getItem('Shows')) || [];
                if (favourites.length === 0) {
                    localStorage.setItem('Shows', JSON.stringify(showdata));
                }

                await Promise.all(showdata.map((show: Episode) => fetchDetailedShowData(show.id)));
            } catch (error) {
                console.error('Failed to fetch show data:', error);
            }
        }

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
                        description: episode.description
                    }))
                );

                const storedEpisodes = JSON.parse(localStorage.getItem('episodes')) || [];
                const updatedEpisodes = [...storedEpisodes, ...episodesData];
                
                const uniqueEpisodes = Array.from(new Set(updatedEpisodes.map((e: Episode) => e.episodeId)))
                    .map((id: string) => updatedEpisodes.find((e: Episode) => e.episodeId === id));

                localStorage.setItem('episodes', JSON.stringify(uniqueEpisodes));

                const favouriteEpisodesFiltered = uniqueEpisodes.filter((episode: Episode) => episode.isFavourite);

                setFavouriteEpisodes(favouriteEpisodesFiltered);
            } catch (error) {
                console.error('Failed to fetch detailed show data:', error);
            }
        }

        fetchData();
    }, []);

    return favouriteEpisodes;
};
