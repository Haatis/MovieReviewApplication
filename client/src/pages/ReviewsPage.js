import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';



export default function ReviewsPage() {
   let { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [movie, setMovie] = useState([]);
    const [show, setShow] = useState(false);
    const [cast, setCast] = useState([]);
    const API_KEY = process.env.REACT_APP_API_KEY;
    const token = localStorage.getItem('token');
    const isLoggedIn = token != null;
    const user = isLoggedIn ? jwt_decode(token) : null;
    const navigate = useNavigate();

    const getMovieCredits = () => {
      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
        .then((response) => {
          const cast = response.data.cast;
          //filter known for department to be acting
          const filteredCast = cast.filter((actor) => {
            return actor.known_for_department === 'Acting';
          });
          
          setCast(filteredCast.slice(0, 5));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getReviews = () => {
        axios.get(`http://localhost:3001/reviews/${id}`).then((response) => {
            setReviews(response.data);
            console.log(response.data)
        }).catch((error) => {
            console.log(error);
        });
    };

    const getMovie = () => {
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`).then((response) => {
          setMovie(response.data);
          console.log(response.data);
        }).catch((error) => {
          console.log(error);
        });
      };

      const deleteReview = (id) => {
        axios.delete(`http://localhost:3001/reviews/${id}`).then((response) => {
          console.log(response.data);
          getReviews();
        }).catch((error) => {
          console.log(error);
        });
      };
      const addReview = (e) => {
        e.preventDefault();
        const name = user.username;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('reviewContent').value;
        if (name === '' || rating === '' || review === '') {
          alert('Please fill out all fields');
          return;
        }
        if (rating < 0 || rating > 10) {
          alert('Please enter a number between 0 and 10');
          return;
        } else if (rating % 1 !== 0) {
          alert('Please enter a whole number between 0 and 10');
          return;
        }
        const newReview = {
          name: name,
          review: review,
          rating: rating,
          movie_id: id
        };
        axios.post('http://localhost:3001/reviews', newReview).then((response) => {
          console.log(response.data);
          getReviews();
          setShow(!show);
        }).catch((error) => {
          console.log(error);
        });
      };

      useEffect(() => {
        window.scrollTo(0, 0);
        getMovieCredits();
        getReviews();
        getMovie();
      }, []);
    

      return (
        <div className='min-h-screen bg-gray-900 text-white'>
          <div className='container mx-auto py-16'>
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-col items-center">
                {movie && (
                  <>
                    <img className="w-64 h-96 object-cover rounded-lg mb-8" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <h1 className='text-3xl font-bold text-center'>{movie.title}</h1>
                    <p className='text-lg text-gray-500 text-center'>{movie.release_date}</p>
                    <p className='text-lg text-gray-500 text-center mt-2'>Runtime: {movie.runtime} minutes</p>
                    {movie.genres && (
                      <p className='text-lg text-gray-500 text-center mt-2'>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
                    )}
                    <p className='text-lg text-gray-500 text-center mt-2'>Director: {movie.director}</p>
                    <div className='max-w-3xl mx-auto my-8'>
                      <p className='text-lg text-gray-500 text-center'>{movie.overview}</p>
                    </div>
                    <p className='text-lg text-gray-500 text-center'>Average user rating: ★{movie.average_rating}</p>
                  </>
                )}
                <div className='mt-16'>
                  <h2 className='text-2xl font-medium text-center mb-8'>Cast</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {cast && cast.map((actor) => {
                      return (
                        <Link key={actor.id} to={`/ActorPage/${actor.id}`}>
                        <div key={actor.id} className='flex flex-col items-center'>
                          <img className='w-36 h-36 object-cover rounded-full mb-2' src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                          <p className='text-lg font-medium text-center'>{actor.name}</p>
                        </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
                <div className='mt-16 flex flex-col items-center w-full'>
                  <h2 className='text-2xl font-medium mb-8'>Reviews</h2>
                  {!isLoggedIn ? (
 <div className='flex items-center justify-center'>
 <div className='flex flex-col justify-center'>
   <p className='text-center'>Please login to leave a review.</p>
  <button
   onClick={() => navigate("/login")} className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mt-4 block'
  >
    Login
  </button>
 </div>
</div>
) : (
  !show ? (
    <button
      onClick={() => setShow(!show)}
      className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-4'
    >
      Add a review
    </button>
  ) : (
    <div className='max-w-lg w-full my-8'>
      <form onSubmit={(e) => addReview(e)} className='flex flex-col items-center'>
        <div className='mb-4 w-full'>
          <label className='text-lg font-medium'>Rating (0-10)</label>
          <input
            id='rating'
            className='bg-gray-800 text-white rounded-lg w-full h-8 pl-2'
            type='number'
            name='rating'
            min='0'
            max='10'
            required
          />
        </div>
        <div className='mb-4 w-full'>
          <label className='text-lg font-medium'>Review</label>
        </div>
        <textarea
          id='reviewContent'
          className='bg-gray-800 text-white rounded-lg w-full h-24 pl-2'
          name='reviewContent'
        />
        <div className='flex justify-between w-full max-w-lg'>
          <button
            onClick={(e) => addReview(e)}
            className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mt-2 mb-2'
          >
            Submit
          </button>
          <button
            onClick={() => setShow(!show)}
            className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mt-2 mb-2'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
)}
  {reviews.length > 0 ? (
    <div className='flex flex-col items-center w-full'>
      {reviews.map((review, index) => {
  return (
    <div className='bg-gray-400 text-center my-4 p-8 rounded-lg w-full max-w-lg' key={index}>
      {user && review.reviewerName === user.username && (
        <button
          className='bg-red-500 text-white font-bold py-2 px-4 rounded-full'
          onClick={() => deleteReview(review.id)}
        >
          X
        </button>
      )}
      <p className='text-lg font-medium'>{review.reviewerName}</p>
      <p className='text-gray-600'>{review.reviewContent}</p>
      <p className='text-sm text-gray-500'>{`Rating: ${review.rating}`}</p>
    </div>
  );
})}
    </div>
  ) : (
    <p className='text-center text-white mt-8'>No reviews yet</p>
  )}
</div>
    </div>
    </div>
    </div>
   
    </div>
  )
}
