const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const PORT = 8000;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));