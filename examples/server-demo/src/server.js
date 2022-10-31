/* eslint-disable @typescript-eslint/camelcase */
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './App';
import html from './htmlTemplate';

const PORT = process.env.PORT || 5657;
const app = express();

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(<App />);

  const initialState = {
    recommendations: [
      {
        name: 'Sneakers Hogan Rebel pink',
        objectID: 'MX1234',
        price: {
          value: 278,
          currency: 'EUR',
        },
        image_urls: [
          'https://res.cloudinary.com/hilnmyskv/image/upload/v1638372051/flagship_sunrise/M0E20000000DWIV_0.jpg',
        ],
      },
      {
        name: 'Sneakers Hogan Rebel multi',
        objectID: 'MX1234',
        price: {
          value: 343,
          currency: 'EUR',
        },
        image_urls: [
          'https://res.cloudinary.com/hilnmyskv/image/upload/v1638372051/flagship_sunrise/M0E20000000DWIV_0.jpg',
        ],
      },
      {
        name: 'Sneakers Hogan Rebel white',
        objectID: 'MX1234',
        price: {
          value: 268,
          currency: 'EUR',
        },
        image_urls: [
          'https://res.cloudinary.com/hilnmyskv/image/upload/v1638372051/flagship_sunrise/M0E20000000DWIV_0.jpg',
        ],
      },
    ],
  };

  res.send(
    html({
      body: app,
      initialState,
    })
  );
});

app.use(express.static('./dist'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
