import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
export default function ActorPage() {
    let { id } = useParams();
    const [actor, setActor] = useState([]);
    const [actorMovies, setActorMovies] = useState([]);
    const API_KEY = process.env.REACT_APP_API_KEY;

    const getActor = () => {
        axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`)
          .then((response) => {
            const data = response.data;
            
            setActor(data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const getActorMovies = () => {
        axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`)
          .then((response) => {
            const castMovies = response.data.cast;
            console.log(castMovies.slice(0, 5));
            setActorMovies(castMovies.slice(0, 5));
          })
          .catch((error) => {
            console.log(error);
          });
      };

      useEffect(() => {
        getActor();
        getActorMovies();
        }, []);
    
        return (
            <div className='w-full h-max bg-gray-900'>
                <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center'>
                        <div className='flex flex-col items-center'>
                            {actor && (
                                <>
                                    <img className='w-full h-64 object-contain mt-5' src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt='actor' />
                                    <h1 className='text-2xl font-medium text-gray-300 mt-8'>{actor.name}</h1>
                                    <p className='text-lg font-medium text-gray-500 mt-2'>{actor.birthday}</p>
                                    <p className='text-lg font-medium text-gray-500 mt-2'>{actor.place_of_birth}</p>
                                    <p className='text-lg font-medium text-gray-500 mt-2 mr-20 ml-20'>{actor.biography}</p>
                                </>
                            )}
                            <div className='flex flex-col items-center'>
                                <h1 className='text-2xl font-medium text-gray-500 mt-8'>Movies</h1>
                                <div className='flex flex-row items-center'>
                                    {actorMovies.map((movie) => (
                                        <div className='flex flex-col items-center ml-2 mr-2 mb-5' key={movie.id}>
                                            {movie.poster_path && (
                                                <>
                                                    <img className='w-full h-64 object-contain mt-5' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt='movie' />
                                                    <Link to={`/ReviewsPage/${movie.id}`}><button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mt-4'>Reviews</button></Link>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}
