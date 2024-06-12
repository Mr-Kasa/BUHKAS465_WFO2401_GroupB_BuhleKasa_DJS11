import React, { useState, useEffect, useRef } from 'react';
import Mp3 from '../../HiiiPower.mp3';
import './Player.css';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); 
  const [playbackRate, setPlaybackRate] = useState(1); 
  const [showSettings, setShowSettings] = useState(false); 
  const audioRef = useRef<HTMLAudioElement>(new Audio(Mp3)); 

  useEffect(() => {
    const storedTime = localStorage.getItem('playbackPosition');
    if (storedTime) {
      setCurrentTime(parseFloat(storedTime));
    }

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.currentTime = currentTime;
    localStorage.setItem('playbackPosition', currentTime.toString());
  }, [currentTime]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(event.target.value) / 100) * audioRef.current.duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value) / 100;
    setVolume(newVolume);
  };

  const incrementPlaybackRate = () => {
    setPlaybackRate(prevRate => Math.min(prevRate + 0.1, 2)); // Max rate of 2x
  };

  const decrementPlaybackRate = () => {
    setPlaybackRate(prevRate => Math.max(prevRate - 0.1, 0.5)); // Min rate of 0.5x
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
<div className='Container'>
    <div className="audio-player">
      <audio ref={audioRef} src={Mp3} onTimeUpdate={handleTimeUpdate} />
      <div className="controls">
        <button className="play-pause-btn" onClick={handlePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <input
          className="progress-bar"
          type="range"
          min="0"
          max="100"
          value={(currentTime / audioRef.current.duration) * 100 || 0}
          onChange={handleProgressChange}
        />
        <span className="time-display">
          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
        </span>
      
        <button className="settings-btn" onClick={toggleSettings}>
          {showSettings ? '🔧' : '⚙️'}
        </button>
        
      </div>
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
              <button className="speed-btn" onClick={decrementPlaybackRate}>-</button>
              <button className="speed-btn" onClick={incrementPlaybackRate}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
</div>
  );
};

export default Player;

