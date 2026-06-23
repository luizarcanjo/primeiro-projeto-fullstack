var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./database/database.db')

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


router.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body
  db.run('INSERT INTO users (username ,password , email, phone) VALUES (?,?,?,?)', [username, password, email, phone], (err) => {
    if (err) {
      console.log("Erro ao cirar o usuário", err)
      return res.status(500).send({ error: 'erro ao criaar o usuário' })
    } else {
      res.status(201).send({ mensage: "usuário com sucesso" })
    }
  })
})
/* GET users listing. */
router.get('/', function (req, res, next) {
  users = [
    { nome: "fulano", age: 30 },
    { nome: "fulano", age: 30 },
    { nome: "fulano", age: 30 }
  ]
  res.send(users);
});





module.exports = router;
