import React, { createContext, useState } from 'react';
import { Episode } from '../../types';

/**
 * Interface for the Episode context type.
 * @interface
 */
interface EpisodeContextType {
  /** The currently selected episode, or null if none is selected. */
  currentEpisode: Episode | null;
  /** Function to set the currently selected episode. */
  setCurrentEpisode: (episode: Episode | null) => void;
}

/**
 * EpisodeContext provides the current episode and a function to update it.
 * @constant
 */
export const EpisodeContext = createContext<EpisodeContextType>({
  currentEpisode: null,
  setCurrentEpisode: () => {},
});

/**
 * EpisodeProvider component that uses the EpisodeContext to provide the current episode
 * and a function to update it to its children.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The EpisodeProvider component.
 */
export const EpisodeProvider: React.FC = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  return (
    <EpisodeContext.Provider value={{ currentEpisode, setCurrentEpisode }}>
      {children}
    </EpisodeContext.Provider>
  );
};
