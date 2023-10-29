const URL_ENDPOINT = "http://127.0.0.1:3000";
import { IAnimeDoc } from "../src/index";

describe("Anime Search", () => {
  const tags = [
    "based on a manga",
    "comedy",
    "episodic",
    "fake romance",
    "female harem",
    "harem",
    "heterosexual",
    "high school",
    "kuudere",
    "love polygon",
    "love triangle",
    "mafia",
    "male protagonist",
    "manga",
    "present",
    "primarily female cast",
    "primarily teen cast",
    "romance",
    "romantic comedy",
    "school",
    "school life",
    "shounen",
    "slapstick",
    "slice of life",
    "slow when it comes to love",
    "tomboy",
    "tsundere",
    "yakuza",
  ];
  const searchParam = "Nisekoi";
  it("should return Nisekoi anime", async () => {
    try {
      const res = await fetch(`${URL_ENDPOINT}/?searchParam=${searchParam}`);
      const animeData: IAnimeDoc[] = await res.json();
      expect(res.status).toBe(200);
      expect(animeData.length).toBeGreaterThan(0);
      expect(animeData[0]._id.toString()).toBe("653bae1cc2adc7b001468886");
    } catch (error) {
      throw error;
    }
  });

  it("should return anime similar to Nisekoi's tags", async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        animeId: "653bae1cc2adc7b001468886",
        animeTags: tags,
      }),
    };
    try {
      const res = await fetch(`${URL_ENDPOINT}/recommend`, options);
      const animeData: IAnimeDoc[] = await res.json();

      expect(res.status).toBe(200);

      expect(animeData.length).toBeGreaterThan(0);
      expect(animeData[0]._id.toString()).toBe("653bae1cc2adc7b001468884");
    } catch (error) {
      throw error;
    }
  });
});
