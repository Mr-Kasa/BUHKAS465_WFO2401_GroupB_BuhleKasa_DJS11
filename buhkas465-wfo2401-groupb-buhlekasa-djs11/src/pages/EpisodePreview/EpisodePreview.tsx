import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EpisodeContext } from '../../components/Player/EpisodeContext';
import { Episode, Season } from '../../types';
import { getCurrentDateTime } from '../../UtilFunctions';
import "./episodePreview.css";

/**
 * EpisodePreview component to display and manage episodes of a selected season.
 *
 * @returns {JSX.Element} The EpisodePreview component.
 */
const EpisodePreview: React.FC = () => {
  const location = useLocation();
  const { season } = location.state as { season: Season };
  const { setCurrentEpisode } = useContext(EpisodeContext);

  // State to manage episodes
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    return JSON.parse(localStorage.getItem('episodes') || '[]');
  });

  // Effect to store episodes in local storage when they change
  useEffect(() => {
    localStorage.setItem('episodes', JSON.stringify(episodes));
  }, [episodes]);

  /**
   * Plays the selected episode by setting it in the context.
   * 
   * @param {Episode} episode - The episode to be played.
   */
  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  /**
   * Finds the episode ID based on the episode description.
   * 
   * @param {string} episodeDescription - The description of the episode to find.
   * @returns {string | null} The episode ID if found, otherwise null.
   */
  const findEpisodeId = (episodeDescription: string): string | null => {
    console.log('Searching for episode with values:', { episodeDescription });

    try {
      const episodes: Episode[] = JSON.parse(localStorage.getItem('episodes') || '[]');

      if (!episodes || episodes.length === 0) {
        console.error('No episodes found in local storage.');
        return null;
      }

      const matchingEpisode = episodes.find(
        (episode) => episode.description === episodeDescription
      );

      if (matchingEpisode) {
        console.log('Matching episode found:', matchingEpisode);
        return matchingEpisode.id;
      } else {
        console.error('No episode found with the given criteria.');
        return null;
      }
    } catch (error) {
      console.error('Error finding episode ID:', error);
      return null;
    }
  };

  /**
   * Handles the click event for an episode, playing it and logging the episode ID if found.
   * 
   * @param {Episode} episode - The episode that was clicked.
   */
  const handleEpisodeClick = (episode: Episode) => {
    const episodeId = findEpisodeId(episode.description);
    if (episodeId) {
      console.log('Episode ID found:', episodeId);
      // Perform actions with the episode ID, like storing playback history
    }
    playEpisode(episode);  // Play the episode
  };

  /**
   * Toggles the favourite status of an episode.
   * 
   * @param {Episode} episode - The episode to toggle favourite status.
   */
  const toggleFavourite = (episode: Episode) => {
    const updatedEpisodes = episodes.map((ep) => {
      if (ep.id === episode.id) {
        const updatedEpisode = {
          ...ep,
          isFavourite: !ep.isFavourite,
          dateFavourited: !ep.isFavourite ? getCurrentDateTime() : ""
        };
        console.log('Favourites clicked');
        console.log('Updated Episode:', updatedEpisode);
        return updatedEpisode;
      }
      return ep;
    });

    setEpisodes(updatedEpisodes);
    localStorage.setItem('episodes', JSON.stringify(updatedEpisodes));
    const currentEpisode = updatedEpisodes.find(ep => ep.id === episode.id);
    console.log('Current Episode:', currentEpisode);
  };

  return (
    <div className='episodeLayout'>
      <h1>{season.title}</h1>
      <div className='EpisodesContainer'>
        <img className='seasonImg' src={season.image} alt={season.title} />
        <ul className='listItems'>
          {season.episodes.map((episode) => {
            const storedEpisode = episodes.find(ep => ep.title === episode.title && ep.description === episode.description) || episode;
            return (
              <div  key={storedEpisode.id}>
                <li className='listItem'>
                  <h3>{storedEpisode.title}</h3>
                  <p>{storedEpisode.description}</p>
                  <div className="custom-button playButton" onClick={() => handleEpisodeClick(storedEpisode)}>
                    <h2>▶️</h2>
                  </div>
                  <div className='custom-button favouriteButton' onClick={() => toggleFavourite(storedEpisode)}>
                    <h2>{storedEpisode.isFavourite ? '❤️' : '♡'}</h2>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EpisodePreview;


