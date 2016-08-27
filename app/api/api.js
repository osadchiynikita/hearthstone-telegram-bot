const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const PrettyError = require('pretty-error');
const http = require('http');
const unirest = require('unirest');

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);

app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('API is running');
});

app.get('/search/cards/:cardName', (req, res) => {
  const { cardName } = req.params;

  unirest.get(`${config.restApiHost}/cards/${cardName}`)
  .header("X-Mashape-Key", config.tokens.mashape)
  .header("Accept", "application/json")
  .end((result) => {
    res.send(result.body);
  });
});

const apiServer = app.listen(3030, '127.0.0.1', () => {
  const host = apiServer.address().address;
  const port = apiServer.address().port;

  console.info('API Server is running at http://%s:%s', host, port);
});