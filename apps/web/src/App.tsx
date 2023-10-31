import { FormEvent, useState } from 'react';
import { AnimeTitle } from '../../api/anime_types/anime';
import { Link } from 'react-router-dom';

function App() {
  const [searchParam, setSearchParam] = useState('');
  const [animeData, setAnimeData] = useState<AnimeTitle[] | []>([]);
  const [err, setErr] = useState('search some anime');
  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchParam) {
      console.log('______');

      return;
    }
    const url = 'http://localhost:3000';
    try {
      const res = await fetch(`${url}/?searchParam=${searchParam}`);
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
        console.error(error);
      }
    }
  };
  return (
    <section className="h-screen scroll-smooth">
      <div className="text-gray-100 ">
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
      <div className="bg-custom-bg min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {animeData.length >= 1 ? (
            animeData.map((anime) => {
              return (
                <Link to={`/recommendations?_id=${anime._id}&tags=${anime.tags}`} className="block  hover:text-gray-400 duration-100 py-2">
                  <AnimeSearchResCard anime={anime} />
                </Link>
              );
            })
          ) : (
            <div className="w-screen text-center text-gray-100  font-bold text-xl">
              <p>{err}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const AnimeSearchResCard = ({ anime }: { anime: AnimeTitle }) => {
  return (
    <div className="bg-custom-bg p-2 sm:p-4 md:p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 duration-300">
      <img src={anime.picture} alt={anime.title} className="w-full h-32 object-cover rounded-t-lg" />
      <div className="p-2">
        <h2 className="text-lg font-bold text-white">{anime.title}</h2>
      </div>
    </div>
  );
};
export default App;
