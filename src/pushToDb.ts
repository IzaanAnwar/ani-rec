import { readFileSync } from "fs";
import {
  connectToDB,
  IAnime,
  AnimeModel,
  createIndexOnsSyn,
} from "./db_connection";

const main = async () => {
  await connectToDB();
  createIndexOnsSyn();
  const anime_data = readFileSync(
    __dirname + "/anime-data/anidata.json",
    "utf-8",
  );
  const animeJsonArray: [] = await JSON.parse(anime_data);
  animeJsonArray.forEach((anime: IAnime) => {
    const newAnime = new AnimeModel(anime);
    try {
      newAnime.save();
      console.log("[Succes]: OK");
    } catch (error) {
      console.log("[Error]: ", error);
    }
  });
};
main()
  .then((dat) => {
    console.log("TASK FINISHED");
    process.exit();
  })
  .catch((err) => console.log(err));
