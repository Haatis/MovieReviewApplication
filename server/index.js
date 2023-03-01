const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'movies_app'
});

app.get('/movies', (req, res) => {
    const query = `
    SELECT 
    movies.*,
    ROUND(AVG(reviews.rating), 1) AS average_rating
FROM 
    movies 
    LEFT JOIN reviews ON movies.id = reviews.movieId
GROUP BY 
    movies.id;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

//get all reviews for a movie
app.get('/reviews/:id', (req, res) => {
    const query = `
    SELECT * FROM reviews WHERE movieId = ${req.params.id};
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});



//get movie by id
app.get('/movies/:id', (req, res) => {
    const query = `
      SELECT movies.*, ROUND(AVG(reviews.rating), 1) AS average_rating
      FROM movies
      LEFT JOIN reviews ON movies.id = reviews.movieId
      WHERE movies.id = ${req.params.id}
      GROUP BY movies.id;
    `;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result); // assuming there is only one movie with the given ID
      }
    });
  });

  //add a review
    app.post('/reviews', (req, res) => {
        const query = `
        INSERT INTO reviews (reviewerName, reviewContent, rating, movieId)
        VALUES ('${req.body.name}', '${req.body.review}', ${req.body.rating}, ${req.body.movie_id});
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    //add a movie
    app.post('/movies', (req, res) => {
        const query = `
        INSERT INTO movies (title, genre, description, director, actors, releaseYear, imageURL)
        VALUES ('${req.body.title}', '${req.body.genre}', '${req.body.description}', '${req.body.director}', '${req.body.actors}', ${req.body.releaseYear}, '${req.body.imageURL}');
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    //delete a movie
    app.delete('/movies/:id', (req, res) => {
        const query = `
        DELETE FROM movies WHERE id = ${req.params.id};
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });

    //delete a review
    app.delete('/reviews/:id', (req, res) => {
        const query = `
        DELETE FROM reviews WHERE id = ${req.params.id};
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
    
    app.post('/register', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal server error');
                return;
            }
            const query = `
            INSERT INTO users (username, password, email)
            VALUES ('${username}', '${hash}', '${email}');
            `;
            db.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error');
                    return;
                }
                res.status(200).send('User registered successfully');
            });
        });
    });

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
      
        const query = `SELECT * FROM users WHERE username = '${username}'`;
        db.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
          }
      
          if (result.length === 0) {
            res.status(401).send('Invalid username or password');
            return;
          }
      
          const user = result[0];
          bcrypt.compare(password, user.password, (err, isValid) => {
            if (err) {
              console.log(err);
              res.status(500).send('Internal server error');
              return;
            }
      
            if (isValid) {
              // Create a JWT containing the user's id, username, and email
              const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                'secret-key',
                { expiresIn: '30d' } // token will expire in 30 days
              );
      
              // Set the JWT as a cookie in the response
              res.cookie('token', token, {
                httpOnly: true,
                secure: true, // set this to true if you're using HTTPS
                maxAge: 30 * 24 * 60 * 60 * 1000 // cookie will expire in 30 days (in milliseconds)
              });
      
              // Send a JSON response to the client containing the token
              res.status(200).json({ token: token });
            } else {
              res.status(401).send('Invalid username or password');
            }
          });
        });
      });

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
