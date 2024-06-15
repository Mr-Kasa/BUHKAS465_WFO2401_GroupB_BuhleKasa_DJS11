
export async function fetchAllPodcasts() {
  try {
    const response = await fetch('https://podcast-api.netlify.app');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw new Error('Failed to fetch podcasts. Please try again later.');
  }
}





export interface Podcast {
  id: string;
  title: string;
  image: string;
  seasons: number;
}

export function sortByTitleAlphabetically(podcasts: Podcast[]): Podcast[] {
  return podcasts.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

export function sortByTitleReverseAlphabetically(podcasts: Podcast[]): Podcast[] {
  return podcasts.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return 1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return -1;
    }
    return 0;
  });
}



export function addIsFavouriteProperty(array) {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  return array.map(item => {
    item.isFavourite = favourites.includes(item.id);
    return item;
  });
}




