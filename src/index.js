const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// const crypto = require('crypto-js');
// const cryptoRandomString = require('crypto-random-string');
// const randomBytes = require('randombytes');
const randomstring = require('randomstring');

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

app.get('/talker/:id', (req, res) => {
  const dataFile = JSON.parse(fs.readFileSync('./src/talker.json', 'utf8'));
  const param = Number(req.params.id);
  const filter = dataFile.find(({ id }) => id === Number(param));
  if (filter) {    
    res.status(200).json(filter);
  } else {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

const validData = (email, password, res) => {
  const valid = /\S+@\S+\.\S+/; // https://www.horadecodar.com.br/2020/09/13/como-validar-email-com-javascript/
  if (valid.test(email)) {
    if (password.length >= 6) {
      // res.status(201).json({ message: 'Senha correta' });
      } else {
      res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    const token = randomstring.generate(16);
    res.status(200).json({ token });
    } else {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
};

const data = (email, password, res) => {
  if (email) {
    if (password) {
      validData(email, password, res);
    } else {
      res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
  } else {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  data(email, password, res);
});

app.listen(PORT, () => {
  console.log('Online');
});
