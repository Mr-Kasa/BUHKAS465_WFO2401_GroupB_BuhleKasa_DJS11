export interface Episode {
    title: string;
    description: string;
    episode: number;
    file: string;
  }

export interface Season {
   title:string;
   season:number;
   episodes: [];
}
  