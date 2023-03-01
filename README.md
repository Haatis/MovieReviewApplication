# MovieReviewApplication
<h3>This is a fullstack project, which displays movies from TMDB and has its own MySQL database, for users and reviews.</h3>

<h3>How to install:</h3>
<p>Run 'npm i' on client and server.</p>
<p>Create a MySQL database with the schema.sql found in server folder.</p>
<p>Create .env files on both client and server.</p>
<p>Client .env needs an api key from TMDB to display the movies, after you have that just add it to the .env file REACT_APP_API_KEY='your key'</p>
<p>For the server .env file DB_PASSWORD='password to your db'</p>
<p>Also if necessary change  host: 'localhost', user: 'root' from server/index.js, if necessary.</p>

<h3>Features:</h3>
Most popular/highest rated movies from TMDB, movie details, actor details, leaving reviews for movies, register/login for users.
