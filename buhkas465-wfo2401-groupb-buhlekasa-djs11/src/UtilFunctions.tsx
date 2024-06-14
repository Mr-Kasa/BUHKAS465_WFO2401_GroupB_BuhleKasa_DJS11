// function to get podcasts 
//function to get function to get show using id
//function to sort alphabetically
// function to sort reverse alphabetically 
// function to render shows to ui
//

export async function fetchPodcasts() {
  try {
    const response = await fetch('https://podcast-api.netlify.app');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Full API Response:', data); // Log the entire response
    if (data && data.podcasts) {
      return data.podcasts;
    } else if (Array.isArray(data)) {
      return data; // If the response is an array of podcasts
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
  imageUrl: string;
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







