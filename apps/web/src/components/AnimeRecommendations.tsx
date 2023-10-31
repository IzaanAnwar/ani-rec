import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IAnimeCard } from '../../../api/anime_types/anime';

export default function AnimeRecommendations() {
  const location = useLocation();
  const [animeData, setAnimeData] = useState<IAnimeCard[] | undefined>();

  const data = new URLSearchParams(location.search);
  const animeId = data.get('_id');
  const animeTags = data.get('tags');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/recommend', {
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
      }
    };
    fetchData();
  }, []);
  return (
    <section className="bg-custom-bg min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {animeData?.map((anime) => <AnimeCard key={anime._id.toString()} anime={anime} />)}
      </div>
    </section>
  );
}

function AnimeCard({ anime }: { anime: IAnimeCard }) {
  return (
    <div className="bg-custom-bg p-4 sm:p-6 md:p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img src={anime.picture} alt={anime.title} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">{anime.title}</h2>
          <div className="flex items-center text-gray-300">
            <span className="mr-4">Status: {anime.status}</span>
            <span>Type: {anime.type}</span>
          </div>
          <div className="text-gray-300 mt-2">Episodes: {anime.episodes}</div>
        </div>
      </div>
    </div>
  );
}
