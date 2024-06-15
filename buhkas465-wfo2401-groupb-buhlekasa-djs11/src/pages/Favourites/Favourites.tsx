
import React, { useEffect, useState } from 'react';

interface Show {
    id: string;
    title: string;
    image: string;
}

interface Episode {
    showId: string;
    episodeId: string;
    episodeTitle: string;
    showTitle: string;
    showImage: string;
    seasonImage: string;
    file: string;
    isFavourite: boolean;
}

const FavouriteEpisodes: React.FC = () => {
    const [favouriteEpisodes, setFavouriteEpisodes] = useState<Episode[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://podcast-api.netlify.app');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Show[] = await response.json();

                const showdata = data.map(show => ({
                    id: show.id,
                    title: show.title,
                    image: show.image
                }));

                const favourites: Show[] = JSON.parse(localStorage.getItem('favourites')) || [];
                if (favourites.length === 0) {
                    localStorage.setItem('favourites', JSON.stringify(showdata));
                }

                // Fetch detailed data for all shows
                await Promise.all(showdata.map(show => fetchDetailedShowData(show.id)));
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
                const favourites: Show[] = JSON.parse(localStorage.getItem('favourites')) || [];
                const show = favourites.find(fav => fav.id === showId);

                if (!show) {
                    console.error('Show not found in favourites');
                    return;
                }

                const episodesData: Episode[] = data.seasons.flatMap(season =>
                    season.episodes.map(episode => ({
                        showId: showId,
                        episodeId: `episode-${showId}-${season.season}-${episode.episode}`,
                        episodeTitle: episode.title,
                        showTitle: show.title, // Include show title from favourites
                        showImage: show.image,
                        seasonImage: season.image,
                        file: episode.file,
                        isFavourite: false // Default value when creating new episodes
                    }))
                );

                const storedEpisodes: Episode[] = JSON.parse(localStorage.getItem('episodes')) || [];
                const updatedEpisodes: Episode[] = [...storedEpisodes, ...episodesData];
                
                // Optimize storage by only storing essential data and avoiding duplicates
                const uniqueEpisodes: Episode[] = Array.from(new Set(updatedEpisodes.map(e => e.episodeId)))
                    .map(id => updatedEpisodes.find(e => e.episodeId === id)) as Episode[];

                localStorage.setItem('episodes', JSON.stringify(uniqueEpisodes));

                // Filter episodes to show only favourites
                const favouriteEpisodesFiltered: Episode[] = uniqueEpisodes.filter(episode => episode.isFavourite);

                // Update state with filtered favourite episodes
                setFavouriteEpisodes(favouriteEpisodesFiltered);
            } catch (error) {
                console.error('Failed to fetch detailed show data:', error);
            }
        };

        fetchData();
    }, []); // Run once on component mount

    const playEpisode = (file: string) => {
        console.log('Playing episode:', file);
        // Add your logic to play the episode here
    };

    return (
        <div>
            <h1>Podcast Shows</h1>
            {favouriteEpisodes.map(episode => (
                <div key={episode.episodeId} className="show-container">
                    <div className="show-background" style={{ backgroundImage: `url(${episode.showImage})` }}></div>
                    <div>
                        <img src={episode.seasonImage} alt={`Season ${episode.seasonId} Image`} />
                        <div className="episode">
                            <h1>{episode.episodeTitle}</h1>
                            <button onClick={() => playEpisode(episode.file)}>Play</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FavouriteEpisodes;
