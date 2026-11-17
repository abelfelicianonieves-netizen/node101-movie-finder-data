const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));

let cache = {};

app.get('/', async function(req, res) {
  let movie = req.query;
  let key = JSON.stringify(movie);

  // Check if the movie is already saved
  if (cache[key] && Date.now() - cache[key].time < 86400000) {
    return res.json(cache[key].data);
  }

  // Set up the API request
  let params = {
    apiKey: '8730e0e'
  };

  if (movie.i) {
    params.i = movie.i;
  }

  if (movie.t) {
    params.t = movie.t;
  }

  // Get movie information
  try {
    let response = await axios.get('http://www.omdbapi.com', {
      params: params
    });

    // Save the movie in our cache
    cache[key] = {
      data: response.data,
      time: Date.now()
    };

    // Send the movie information
    res.json(response.data);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Could not get movie data' });
  }
});

module.exports = app;