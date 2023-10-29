import express, { Request, Response } from "express";
import { Condition, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

interface IAnime {
  _id: ObjectId;
  title: string;
  type: string;
  episodes: number;
  status: "FINISHED" | "ONGOING" | "UPCOMING" | "UNKNOWN";
  animeSeason: {
    season: "FALL" | "SUMMER" | "WINTER" | "SPRING" | "UNDEFINED";
    year: number;
  };
  picture: string;
  synonyms: [string];
  tags: [string];
}
const app = express();
app.use(express.json());
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);
client
  .connect()
  .then(() => {
    console.log("[Connected to MongoDB]");
  })
  .catch((err) => {
    console.error("[Error connecting to MongoDB]: ", err);
  });

type AnimeTitle = Pick<IAnime, "_id" | "title" | "tags">;
type AnimeTags = Pick<IAnime, "tags">;

app.post("/recommend", async (req: Request, res: Response) => {
  const { animeTags, animeId }: { animeTags: AnimeTags[]; animeId: string } =
    await req.body;
  if (!animeTags || !animeTags.length || !animeId) {
    return res.status(400).json({
      message:
        "Please provide an AnimeTags, and the animeId to proceed with the query",
    });
  }

  try {
    const db = client.db();
    const animeColl = db.collection("anime");
    const animeIdObj = new ObjectId(animeId);

    const queryAggr = [
      {
        $search: {
          index: "tags_anime",
          autocomplete: { query: animeTags, path: "tags" },
        },
      },
      {
        $match: {
          _id: { $ne: animeIdObj },
        },
      },
      { $limit: 20 },
    ];
    const anime = await animeColl.aggregate<IAnime>(queryAggr).toArray();

    res.json({ anime });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong please try again",
    });
  }
});

app.get("/", async (req: Request, res: Response) => {
  const { searchParam } = req.query;

  const db = client.db();
  const AnimeColl = db.collection("anime");
  const query = [
    {
      $search: {
        index: "synonyms_anime",
        autocomplete: { query: searchParam || "A", path: "synonyms" },
      },
    },
    { $limit: 10 },
    { $project: { _id: 1, title: 1, tags: 1 } },
  ];
  const anime = await AnimeColl.aggregate<AnimeTitle>(query).toArray();
  res.json(anime);
});
app.listen(3000, () => {
  console.log("[SERVER RUNNIG ON]: 3000");
});
