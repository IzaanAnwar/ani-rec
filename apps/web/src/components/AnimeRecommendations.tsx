import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IAnimeCard } from '../../../api/anime_types/anime';
import { Loader2, MoveLeft } from 'lucide-react';

export default function AnimeRecommendations() {
  const location = useLocation();
  const [animeData, setAnimeData] = useState<IAnimeCard[] | undefined>();
  const [loading, setLoading] = useState(false);

  const data = new URLSearchParams(location.search);
  const animeId = data.get('_id');
  const animeTags = data.get('tags');
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch('https://ani-rec-api.vercel.app/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            animeId,
            animeTags,
          }),
        });
        const data: IAnimeCard[] = await res.json();
        setAnimeData(data);
      } catch (error) {
        alert('something went wrong please go to previous page and try again');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="w-full  flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="w-full px-2 md:px-12 lg:px-24 py-6  ">
            <Link to={'/'}>
              <MoveLeft size={40} className="hover:translate-x-[-7px] duration-300" />
            </Link>
          </div>
          <section className="bg-custom-bg min-h-screen flex items-center justify-center px-2 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {animeData?.map((anime) => <AnimeCard key={anime._id.toString()} anime={anime} />)}
            </div>
          </section>
        </>
      )}
    </>
  );
}

function AnimeCard({ anime }: { anime: IAnimeCard }) {
  return (
    <div className="px-2 md:px-4 py-2 border rounded-lg ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded w-full h-48 rounded-t-lg overflow-clip hover:scale-105 duration-300">
          <img src={anime.picture} alt={anime.title} className="w-full rounded  h-full object-contain " />
        </div>
        <div className="p-4">
          <h2 className="text-xl   font-bold text-black">{anime.title.length > 56 ? anime.title.slice(0, 57) + '...' : anime.title}</h2>
          <div className="flex items-center text-zinc-900">
            <span className="mr-4">Status: {anime.status}</span>
            <span>Type: {anime.type}</span>
          </div>
          <div className="text-zinc-700 mt-2">Episodes: {anime.episodes}</div>
        </div>
      </div>
    </div>
  );
}
