const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const dataFile = fs.readFileSync('./talker.json', 'utf8');
const data = JSON.parse(dataFile);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (req, res) => {
  res.status(200).json(data);
});

app.listen(PORT, () => {
  console.log('Online');
});
