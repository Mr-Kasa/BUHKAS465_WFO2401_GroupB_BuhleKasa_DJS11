import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import InnerLayout from './components/InnerLayout/InnerLayout';
import History from "./pages/History/History";
import Favourites from "./pages/Favourites/Favourites";
import ShowPreview from './pages/ShowPreview/ShowPreview';
import SeasonPreview from './pages/SeasonPreview/SeasonPreview';
import EpisodePreview from './pages/EpisodePreview';

function App() {
  // Assuming you have showData and seasonData variables containing the relevant data
  const showData = { id: 'show_id', title: 'Show Title' };
  const seasonData = { id: 'season_id', imageUrl: 'season_image_url', number: 1 };

  return (
    <BrowserRouter>
<Routes>
  <Route path='/' element={<Layout show={showData} season={seasonData} />}>
    <Route element={<InnerLayout />}>
      <Route index element={<Home />} />
      <Route path="History" element={<History />} />
      <Route path='Favourites' element={<Favourites />} />
      <Route path='/show/:id' element={<ShowPreview />} />
      <Route path='/show/:id/seasons' element={<SeasonPreview />} />
      <Route path='/show/:id/seasons/:seasonId/episodes' element={<EpisodePreview />} />
    </Route>
  </Route>
</Routes>


    </BrowserRouter>
  );
}

export default App;
