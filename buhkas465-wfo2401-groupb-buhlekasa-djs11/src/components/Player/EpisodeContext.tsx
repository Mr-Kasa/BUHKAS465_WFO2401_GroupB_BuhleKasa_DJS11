import React, { createContext, useState } from 'react';
import { Episode } from '../../types';

interface EpisodeContextType {
  currentEpisode: Episode | null;
  setCurrentEpisode: (episode: Episode | null) => void;
}

export const EpisodeContext = createContext<EpisodeContextType>({
  currentEpisode: null,
  setCurrentEpisode: () => {},
});

export const EpisodeProvider: React.FC = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  return (
    <EpisodeContext.Provider value={{ currentEpisode, setCurrentEpisode }}>
      {children}
    </EpisodeContext.Provider>
  );
};
