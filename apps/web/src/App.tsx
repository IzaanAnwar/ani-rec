import { FormEvent, useCallback, useState } from 'react';
import { AnimeTitle } from '../../api/anime_types/anime';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function App() {
  const [searchParam, setSearchParam] = useState('');
  const [animeData, setAnimeData] = useState<AnimeTitle[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('search some anime');

  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();
      if (!searchParam) {
        return;
      }
      const url = 'http://localhost:3000';
      // const url2 = 'http:localhost:3000/';
      console.log('url \n\n\\n\n', url);

      try {
        const res = await fetch(`${url}?searchParam=${searchParam}`);
        console.log(res, 'res');

        const data = await res.json();
        console.log(data);

        if (data.length >= 1) {
          setAnimeData(data);
        } else {
          console.log(err, 'jk');
          setErr('Not Found');
          console.log(err, 'af');
        }
      } catch (error: any) {
        setErr(error.message);
        if (error instanceof Error) {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [searchParam],
  );
  return (
    <section className="h-full scroll-smooth px-2 md:px-12 lg:px-24">
      <div className="text-white ">
        <form onSubmit={handleSearch} method="get" className="flex justify-center items-center p-4 mt-12">
          <label htmlFor=""></label>
          <input
            className="text-gray-950 rounded-md px-4 py-2 border-gray-200 border-2"
            type="text"
            name="search"
            placeholder="Search"
            value={searchParam}
            onChange={(e) => {
              e.preventDefault();
              setSearchParam(e.target.value);
            }}
          />
          <button className="rounded-md px-4 py-2 mx-2 hover:bg-cyan-900 bg-cyan-950 duration-250 " type="submit">
            Search
          </button>
        </form>
      </div>
      {loading ? (
        <div className="w-full  flex justify-center items-center h-[50vh]">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="bg-custom-bg min-h-full flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {animeData.length >= 1 ? (
              animeData.map((anime) => {
                return (
                  <Link to={`/recommendations?_id=${anime._id}&tags=${anime.tags}`} className="block  hover:text-zinc-700 duration-100 py-2">
                    <AnimeSearchResCard anime={anime} />
                  </Link>
                );
              })
            ) : (
              <div className="w-screen text-center text-zinc-900  font-bold text-xl">
                <p>{err}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const AnimeSearchResCard = ({ anime }: { anime: AnimeTitle }) => {
  return (
    <div className="hover:text-blue-800 duration-300  px-2 md:px-4 py-2 rounded-lg border flex justify-start gap-4  transform transition-transform ">
      <div className="rounded w-full h-full rounded-t-lg overflow-clip hover:scale-105 duration-300 ">
        <img src={anime.picture} alt={anime.title} className="w-full h-32 object-contain rounded-t-lg" />
      </div>
      <div className="">
        <h2 className="text-lg font-bold ">{anime.title.length > 56 ? anime.title.slice(0, 57) + '...' : anime.title}</h2>
      </div>
    </div>
  );
};
export default App;
