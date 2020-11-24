const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();

app.use(morgan('common'));

const googleApps = [ ...playstore ];
const appGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

function handleGetApps(req, res) {
  const { sort, genres } = req.query;

  if (sort && !['rating', 'app'].includes(sort)) {
    return res.status(400).send('Apps must be sorted by "rating" or "app".')
  }

  if (genres && !appGenres.includes(genres)) {
    return res.status(400).send(`You must select one of these genres:\n ${appGenres.join('\n')}`);
  }

  const results = (genres) ? 
    googleApps.filter(googleApp => googleApp.Genres.includes(genres)) 
    : googleApps;



  if (sort) {
    let sortKeyword = '';

    if (sort === 'rating') {
      sortKeyword = 'Rating';
    } else if (sort === 'app') {
      sortKeyword = 'App';
    } 
    results.sort((a, b) => {
      a = a[sortKeyword];
      b = b[sortKeyword];

      if (a < b) {
        return -1;
      } else if (b < a) {
        return 1;
      } else {
        return 0;
      }
    })
  }
  
  
  res.json(results);
}

app.get('/apps', handleGetApps)

const PORT = 8000;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));