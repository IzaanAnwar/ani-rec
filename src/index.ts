import express from "express";
import { AnimeModel, connectToDB } from "./db_connection";

const app = express();
connectToDB();

app.get("/", async (req, res) => {
  const anime = await AnimeModel.findOne({});
  console.log(anime);
  // res.send("FOund");
  res.send(JSON.stringify(anime));
});
app.listen(3000, () => {
  console.log("[SERVER RUNNIG ON]: 3000");
});
