// function to get podcasts 
//function to get function to get show using id
//function to sort alphabetically
// function to sort reverse alphabetically 
// function to render shows to ui
//

import React, { useState, useEffect } from 'react';

interface Podcast {
  id: string;
  title: string;
  imageUrl: string;
  seasons: number;
}

z: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPodcasts(data.podcasts);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
       
      }
    };

    fetchPodcasts();
  }, []);
}

export async HomeData