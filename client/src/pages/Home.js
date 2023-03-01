
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [imdb, setImdb] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [filter, setFilter] = useState('Rating');
  const API_KEY = process.env.REACT_APP_API_KEY;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = imdb.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(imdb.length / moviesPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  

const fetchGenres = () => {
  axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    .then((response) => {
      setGenres(response.data.genres);
    })
    .catch((error) => {
      console.log(error);
    });
};


const getImdb = (filter) => {
  const MAX_RESULTS = 200;
  let results = [];
  let page = 1;
  let endpoint;

  if (filter === 'Rating') {
    endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=2500&with_original_language=en&include_adult=false`;
  } else if (filter === 'Trending') {
    endpoint = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
  }

  const fetchPage = () => {
    return axios.get(`${endpoint}&page=${page}`)
      .then(response => {
        results = results.concat(response.data.results);
        page++;
        if (results.length < MAX_RESULTS && page <= 10) {
          return fetchPage();
        } else {
          setImdb(results);
        }
      });
  };

  return fetchPage();
};
useEffect(() => {
  getImdb(filter);
  fetchGenres();
}, [filter]);

const handleFilterChange = (event) => {
  setFilter(event.target.value);
  setCurrentPage(1);
};
  
  return (
    <>
      <div className='bg-gray-900'>
      {currentPage > 1 && (
  <div>
    <p className='text-center text-white'>Page {currentPage}/ {totalPages}</p>
    <div className='flex justify-center mt-2'>
      {hasPreviousPage && <button onClick={() =>{ setCurrentPage(currentPage-1); window.scrollTo(0, 0)}} className='bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-5'>Previous page</button>}
      
      {hasNextPage && <button onClick={() => {setCurrentPage(currentPage+1); window.scrollTo(0, 0)}} className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-5'>Next page</button>
      }
    </div>
  </div>
)}
<div className='pt-2'>
  {filter === 'Rating' && <p className='text-center text-white text-2xl'>Top 200 highest rated movies (TMDB)</p>}
  {filter === 'Trending' && <p className='text-center text-white text-2xl'>Top 200 trending movies (TMDB)</p>}
  <div className='flex justify-center items-center h-20'>
  <select
      value={filter}
      onChange={handleFilterChange}
      className='bg-gray-800 text-white py-2 px-4 rounded-full'
    >
      <option value="Rating">Rating</option>
      <option value="Trending">Trending</option>
    </select>
    </div>
</div>
        <div className='container mx-auto px-4 py-10'>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {currentMovies.map((movie, index) => {
              return (
                <div className="bg-gray-800 rounded-lg overflow-hidden relative" key={index}>
                  <img className="w-full h-56 object-contain" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                  <div className="px-4 py-4">
                    <div className="flex flex-row items-center justify-between">
                      <h1 className="text-xl font-medium text-white">{movie.title}</h1>
                      <p className="text-sm text-gray-400">{movie.release_date.slice(0,4)}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2">
                      <div className="flex flex-row items-center">
                        <p className="text-sm text-gray-400 ml-1">{movie.vote_average}</p>
                      </div>
                      <div className="flex flex-row items-center">
                      {movie.genre_ids.slice(0, 2).map((genreId) => {
    const genre = genres.find((g) => g.id === genreId);
    return <span className='text-sm text-gray-400 flex flex-row ml-2 mr-2' key={genreId}>{genre ? genre.name : "N/A"}</span>;
  })}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">{movie.description}</p>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-7 mb-2">
                      <p className="text-sm text-gray-400">{movie.actor}</p>
                      {currentPage > 1 && (
  <p className="text-sm ml-2 text-white absolute bottom-2 left-0 mr-2">#{((currentPage - 1) * 20) + index + 1}</p>
)}
                      {currentPage === 1 && (
                        <p className="text-sm text-white  absolute bottom-2 left-0 mr-2 ml-2">#{index + 1}</p>
                      )}
                      <Link to={`/ReviewsPage/${movie.id}`}>
                        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full absolute bottom-2 right-0 mr-2 ">
                          See user reviews
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div >
        <p className='text-center text-white'>Page {currentPage}/ {totalPages}</p>
        <div className='flex justify-center mt-5 pb-5'>
          {hasPreviousPage && <button onClick={() =>{ setCurrentPage(currentPage-1); window.scrollTo(0, 0)}} className='bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-5'>Previous page</button>}
          
          {hasNextPage && <button onClick={() => {setCurrentPage(currentPage+1); window.scrollTo(0, 0)}} className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-5'>Next page</button>
          }
       </div>
        </div>
      </div>
    </>
  );
}

export default Home;
