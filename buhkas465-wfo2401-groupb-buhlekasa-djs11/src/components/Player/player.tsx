import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import { storePlayedEpisode } from '../../UtilFunctions';

/**
 * Interface for Episode object.
 * @interface
 */
interface Episode {
  id: string;
  title: string;
  description: string;
  episode: number;
  file: string;
}

/**
 * Interface for Player component props.
 * @interface
 */
interface PlayerProps {
  episode: Episode | null;
  showId: string;
  showTitle: string;
  seasonImg: string;
  seasonNumber: number;
}

/**
 * Player component to play podcast episodes with playback controls.
 * 
 * @param {PlayerProps} props - The properties of the Player component.
 * @returns {JSX.Element} The Player component.
 */
const Player: React.FC<PlayerProps> = ({ episode, showId, showTitle, seasonImg, seasonNumber }) => {

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('An error occurred during audio playback.');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (episode) {
      storePlayedEpisode(episode.title, episode.description);

      const audio = audioRef.current;
      audio.src = episode.file;
      audio.load();
      setCurrentTime(0);
      setError(null);
      setIsPlaying(false);

      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setError('Error playing audio. Please try again.');
      });
    }
  }, [episode, showId, showTitle, seasonImg, seasonNumber]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  /**
   * Handles play/pause button click.
   */
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setError('Error playing audio. Please try again.');
      });
    }
  };

  /**
   * Handles progress bar change.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event of the progress bar.
   */
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newTime = (parseFloat(event.target.value) / 100) * duration;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    } catch (error) {
      console.error('Error changing progress:', error);
      setError('Error changing progress. Please try again.');
    }
  };

  /**
   * Handles volume slider change.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event of the volume slider.
   */
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newVolume = parseFloat(event.target.value) / 100;
      setVolume(newVolume);
    } catch (error) {
      console.error('Error changing volume:', error);
      setError('Error changing volume. Please try again.');
    }
  };

  /**
   * Increments the playback rate.
   */
  const incrementPlaybackRate = () => {
    try {
      setPlaybackRate((prevRate) => Math.min(prevRate + 0.1, 2));
    } catch (error) {
      console.error('Error increasing playback rate:', error);
      setError('Error increasing playback rate. Please try again.');
    }
  };

  /**
   * Decrements the playback rate.
   */
  const decrementPlaybackRate = () => {
    try {
      setPlaybackRate((prevRate) => Math.max(prevRate - 0.1, 0.5));
    } catch (error) {
      console.error('Error decreasing playback rate:', error);
      setError('Error decreasing playback rate. Please try again.');
    }
  };

  /**
   * Toggles the display of the settings menu.
   */
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className='footer-container'>
      <div className="audio-player">
        <div className="controls">
          <button className="play-pause-btn" onClick={handlePlayPause} disabled={!episode}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <input
            className="progress-bar"
            type="range"
            min="0"
            max="100"
            value={!isNaN(duration) ? ((currentTime / duration) * 100).toString() : "0"}
            onChange={handleProgressChange}
            disabled={!episode}
          />
          <span className="time-display">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <button className="settings-btn" onClick={toggleSettings}>
          {showSettings ? '🔧' : '⚙️'}
        </button>

        {showSettings && (
          <div className='AudioSettingsDiv'>
            <div className="volume-control">
              <input
                className="volume-slider"
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
              />
              <span className="volume-display">Volume: {Math.round(volume * 100)}</span>
            </div>
            <div className="playback-speed-control">
              <span className="speed-display">Playback Speed: {playbackRate.toFixed(1)}x</span>
              <div className='PlaybackButtons'>
                <button className="speed-btn" onClick={decrementPlaybackRate}>⤵️</button>
                <button className="speed-btn" onClick={incrementPlaybackRate}>⤴️</button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Player;
