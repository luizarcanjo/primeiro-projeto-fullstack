var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./database/database.db')



//criando tabela users
db.run(`CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE
  )`, (err) => {
  if (err) {
    console.error('erro ao criar a tabela users: ', err);
  } else {
    console.log('tabela users criada com sucesso!')
  }
});



// criar usuario
router.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body
  db.run('INSERT INTO users (username ,password , email, phone) VALUES (?,?,?,?)', [username, password, email, phone], (err) => {
    if (err) {
      console.log("Erro ao cirar o usuário", err)
      return res.status(500).send({ error: 'erro ao criaar o usuário' })
    } else {
      res.status(201).send({ mensage: "usuário cadastrado com sucesso" })
    }
  })
})


/* GET users listing. */
router.get('/', function (req, res, next) {
  db.all('SELECT * FROM users', (err, users) => {
    if (err) {
      console.log("usuarios nao foram cadastrados", err)
      return res.status(500).send({ errir: "usuarios nao encontrados" })
    } else {
      res.status(200).send(users)
    }
  })
});

// get by id
router.get('/:id', function (req, res, net) {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id=?', [id], (err, row) => {
    if (err) {
      console.error('usuario nao encontrado', err);
      return res.status(500).json({ error: 'usuario nao encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'usuario nao econtrado' });
    }
    res.status(200).json(row);
  });
});




module.exports = router;
