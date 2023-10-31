import { ObjectId } from 'mongodb';
export interface IAnime {
  _id: ObjectId;
  title: string;
  type: string;
  episodes: number;
  status: 'FINISHED' | 'ONGOING' | 'UPCOMING' | 'UNKNOWN';
  animeSeason: {
    season: 'FALL' | 'SUMMER' | 'WINTER' | 'SPRING' | 'UNDEFINED';
    year: number;
  };
  picture: string;
  synonyms: [string];
  tags: [string];
}
export type IAnimeCard = Pick<IAnime, '_id' | 'title' | 'picture' | 'episodes' | 'type' | 'status'>;
export type AnimeTitle = Pick<IAnime, '_id' | 'title' | 'tags' | 'picture'>;
export type AnimeTags = Pick<IAnime, 'tags'>;
