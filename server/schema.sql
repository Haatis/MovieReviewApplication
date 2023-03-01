DROP DATABASE IF EXISTS movies_app;
CREATE DATABASE movies_app;
USE movies_app;

CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    reviewerName VARCHAR(255) NOT NULL,
    reviewContent TEXT NOT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
    movieId INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
