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

const path = './src/talker.json';

app.get('/talker', (req, res) => {
  const dataFile = JSON.parse(fs.readFileSync(path, 'utf8'));
  res.status(200).json(dataFile);
});

app.get('/talker/:id', (req, res) => {
  const dataFile = JSON.parse(fs.readFileSync(path, 'utf8'));
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

const validName = (req, res) => {
  const { name } = req.body;
  if (name) {
    if (name.length >= 3) {
      console.log(name, 'Nome');
    } else {
      res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
  } else {
    res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
};

const bolAge = (age) => (age >= 18 && Number.isInteger(age));

const validAge = (req, res) => {
  const { age } = req.body;
  if (age) {
    if (bolAge(age)) { 
      console.log(age, 'idade');
    } else {
      res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
  } else {
    res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
};

const tokens = (req, res) => {
  const token = req.headers.authorization;
  // const token = '9999999999999999';
  if (token) {
    if (token.length === 16) {
      return true;
    } res.status(401).json({ message: 'Token inválido' });
  } else {
    res.status(401).json({ message: 'Token não encontrado' });
  }
};

// dd/mm/aaaa - /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/ - https://www.guj.com.br/t/resolvido-como-validar-data-com-java-script/276656

// const validDate = (watchedAt) => {
//   const vectData = watchedAt.split('/');
//   if (vectData.length === 3) {
//     if (vectData[0].length === 2 && vectData[1].length === 2 && vectData[2].length === 4) {
//       return true;
//     } return false;
//   } return false;
// };

const validWatchedAt = (req, res) => {
  const { watchedAt } = req.body.talk;
  if (watchedAt) {
    const validDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (validDate.test(watchedAt)) {
      console.log('valido');
    } else {
      res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
  } else {
    res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
};

const bolRate = (rate) => rate >= 1 && rate <= 5 && Number.isInteger(rate);

const validRate = (req, res) => {
  const { rate } = req.body.talk;
  if (rate) {
    if (bolRate(rate)) {
      console.log('correto');
    } else {
      res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
  } else {
    res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
};

const talks = (req, res) => {
  const { talk } = req.body;
  if (talk) {
    validWatchedAt(req, res);
    validRate(req, res);
  } else {
    res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
};

const pessoa = (req) => {
  const { id, name, age, talk } = req.body;
  return {
    id,
    name,
    age,
    talk,
   };
};

app.post('/talker', (req, res) => {
  const dataFile = JSON.parse(fs.readFileSync(path, 'utf8'));
  // const vec = [...dataFile];
  if (dataFile) {
    const datas = dataFile.push(req.body);
    const pes = pessoa(req);
    console.log(pes);
    fs.writeFileSync(path, JSON.stringify(datas));
    // const token = undefined;
    tokens(req, res);
    validName(req, res);
    validAge(req, res);
    talks(req, res);
    res.status(201).json(pes);
  } else {
    res.status(404).json({ message: 'Erro' });
    // res.end();
  }
});

app.delete('/talker/:id', (req, res) => {
  tokens(req, res);
  const dataFile = JSON.parse(fs.readFileSync(path, 'utf8'));
  const { id } = req.params;
  console.log(dataFile, id, 'Erro aqui');
  if (dataFile) {
    const filArray = dataFile.filter((file) => file.id !== Number(id));
    console.log(filArray);
    fs.writeFile(path, JSON.stringify(filArray));
    res.status(204).json();
  } else {
    res.status(401).json({ message: 'inválido' });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
