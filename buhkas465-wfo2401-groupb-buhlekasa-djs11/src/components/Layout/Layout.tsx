import React, { useState } from "react";
import "./Layout.css";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import Player from "../Player/player";
import { EpisodeContext } from "../Player/EpisodeContext";
import { Episode } from "../../types";

interface LayoutProps {
  show: {
    id: string;
    title: string;
  };
  season: {
    imageUrl: string;
    number: number;
  };
}

export default function Layout({ show, season }: LayoutProps) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  return (
    <div className="Layout">
      <Header />
      <EpisodeContext.Provider value={{ currentEpisode, setCurrentEpisode }}>
        <main>
          <Outlet />
        </main>
        <Player
          episode={currentEpisode}
          showId={show.id}
          showTitle={show.title}
          seasonImg={season.imageUrl}
          seasonNumber={season.number}
        />
      </EpisodeContext.Provider>
    </div>
  );
}
