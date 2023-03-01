import React from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export default function Header() {
  const token = localStorage.getItem('token');
  const isLoggedIn = token != null;
  const user = isLoggedIn ? jwt_decode(token) : null;

  return (
    <div className='bg-gray-800 flex justify-between items-center px-4 py-3'>
      <div>
        <Link to={"/"}><h1 className='text-4xl font-medium text-yellow-500 ml-5'>Movie review application</h1></Link>
      </div>
      <div>
        {isLoggedIn ? (
          <div className='flex items-center'>
            <span className='text-white mr-4'>Logged in as ({user.username})</span>
            <button className='bg-red-500 text-white font-bold py-2 px-4 rounded-full' onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to={"/login"}><button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full mr-4'>Login</button></Link>
            <Link to={"/register"}><button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full'>Register</button></Link>
          </>
        )}
      </div>
    </div>
  );
}