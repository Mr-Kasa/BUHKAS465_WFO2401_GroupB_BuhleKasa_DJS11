import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import InnerLayout from './components/InnerLayout/InnerLayout'
import History from "./pages/History"
import Favourites from "./pages/Favourites"
import ShowPreview from './pages/ShowPreview'
import SeasonPreview from './pages/SeasonPreview'
import Episodepreview from './pages/EpisodePreview'


function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
          <Route path="/" element={<InnerLayout/>}>
            <Route index element={<Home/>} />
            <Route path="History" element={<History/>} />
            <Route path='Favourites' element={<Favourites />} />
            <Route path='/:id' element={<ShowPreview/>}>
              
            </Route>
          
          </Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App


