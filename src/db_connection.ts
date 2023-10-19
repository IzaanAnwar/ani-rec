import {
  model as createModel,
  Schema,
  connect as mongoConnect,
} from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoConnect(`mongodb://localhost:27017/anidata`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export interface IAnime {
  title: string;
  type: string;
  episodes: number;
  status: "FINISHED" | "UPCOMING" | "ONGOING" | "UNKNOWN";
  animeSeason: {
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL" | "UNDEFINED";
    year: number;
  };
  picture: string;
  synonyms: string[];
  tags: string[];
}

export const aniSchema = new Schema<IAnime>({
  title: {
    type: String,
    index: true,
  },
  type: String,
  episodes: String,
  status: {
    type: String,
    enum: ["FINISHED", "UPCOMING", "ONGOING", "UNKNOWN"],
  },
  animeSeason: {
    season: {
      type: String,
      enum: ["WINTER", "SPRING", "SUMMER", "FALL", "UNDEFINED"],
    },
    year: Number,
  },
  picture: String,
  synonyms: [String],
  tags: [String],
});
export const createIndexOnsSyn = () => {
  aniSchema.index({ synonyms: "text" });
};
export const AnimeModel = createModel("Anime", aniSchema);
