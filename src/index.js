const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (req, res) => {
  const dataFile = JSON.parse(fs.readFileSync('./src/talker.json', 'utf8'));
  res.status(200).json(dataFile);
});

app.listen(PORT, () => {
  console.log('Online');
});
