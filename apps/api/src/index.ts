import express, { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { IAnimeCard, AnimeTags, AnimeTitle } from '../anime_types/anime';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const uri = process.env.MONGODB_URL;
const allowedUrl = process.env.ALLOWED_URL;
const allowedUrlTest = process.env.ALLOWED_URL_TEST;
const allowedUrl2 = process.env.ALLOWED_URL_2;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    // origin: allowedUrl ? allowedUrl: allowedUrl2,
    origin: allowedUrl,
    methods: 'GET,POST',
    optionsSuccessStatus: 204,
  }),
);
const client = new MongoClient(uri);
client
  .connect()
  .then(() => {
    console.log('[Connected to MongoDB]');
  })
  .catch((err) => {
    console.error('[Error connecting to MongoDB]: ', err);
  });

app.post('/recommend', async (req: Request, res: Response) => {
  const { animeTags, animeId }: { animeTags: AnimeTags[]; animeId: string } = await req.body;
  if (!animeTags || !animeTags.length || !animeId) {
    console.log(typeof animeId, typeof animeTags);

    return res.status(400).json({
      message: 'Please provide  AnimeTags, and the animeId to proceed with the body',
    });
  }

  try {
    const db = client.db();
    const animeColl = db.collection('anime');
    const animeIdObj = new ObjectId(animeId);

    const queryAggr = [
      {
        $search: {
          index: 'tags_anime',
          autocomplete: { query: animeTags, path: 'tags' },
        },
      },
      {
        $match: {
          _id: { $ne: animeIdObj },
        },
      },
      { $limit: 50 },
    ];
    const anime = await animeColl.aggregate<IAnimeCard>(queryAggr).toArray();
    res.json(anime);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong please try again',
    });
  }
});

app.get('/', async (req: Request, res: Response) => {
  console.log(process.env.NODE_ENV);

  const { searchParam } = req.query;

  const db = client.db();
  const AnimeColl = db.collection('anime');
  const query = [
    {
      $search: {
        index: 'synonyms_anime',
        autocomplete: { query: searchParam || 'A', path: 'synonyms' },
      },
    },
    { $limit: 15 },
    { $project: { _id: 1, title: 1, tags: 1, picture: 1 } },
  ];
  const anime = await AnimeColl.aggregate<AnimeTitle>(query).toArray();
  res.json(anime);
});
app.listen(3000, () => {
  console.log('[SERVER RUNNIG ON]: 3000');
});
