import { useState, useEffect } from 'react';


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

export function sortByTitleReverseAlphabetically(podcasts: Podcast[]): Podcast[] {
  return podcasts.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return 1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return -1;
    }
    return 0;
  });
}


export const storePlayedEpisode = (episodeFile, episodeTitle) => {
  console.log(episodeFile, episodeTitle);

  const findEpisodeId = (episodeFile, episodeTitle) => {
    // Retrieve episodes array from local storage
    const episodes = JSON.parse(localStorage.getItem('episodes')) || [];
  
    // Find the episode with matching file and episodeTitle
    const foundEpisode = episodes.find(episode => episode.file === episodeFile && episode.episodeTitle === episodeTitle);
  
    // If episode is found, log it and its ID
    if (foundEpisode) {
      console.log('Episode found:', foundEpisode);
      console.log('Episode ID:', foundEpisode.episodeId);
    }

    // If episode is found, return its episodeId, otherwise return null
    return foundEpisode ? foundEpisode.episodeId : null;
  };

  // Get the episodeId using findEpisodeId function
  const episodeId = findEpisodeId(episodeFile, episodeTitle);

  // Ensure episodeId is valid before storing
  if (!episodeId) {
    console.error('Invalid episodeId for the given episodeFile and episodeTitle.');
    return;
  }

  // Construct the played episode object
  const playedEpisode = {
    episodeId: episodeId,
    episodeTitle: episodeTitle
  };

  try {
    // Get existing played episodes from localStorage
    let playedEpisodes = JSON.parse(localStorage.getItem('playedEpisodes')) || [];

    // Add the new episode to the array
    playedEpisodes.push(playedEpisode);

    // Save the updated array back to localStorage
    localStorage.setItem('playedEpisodes', JSON.stringify(playedEpisodes));

    // Retrieve all the data of the found episode object
    const allEpisodeData = JSON.parse(localStorage.getItem('episodes')) || [];
    const foundEpisodeData = allEpisodeData.find(episode => episode.file === episodeFile && episode.episodeTitle === episodeTitle);

    // Ensure found episode data is valid before storing in history
    if (foundEpisodeData) {
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history.push(foundEpisodeData);
      localStorage.setItem('history', JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error storing played episode:', error);
  }
};














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
                        isFavourite: false
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
