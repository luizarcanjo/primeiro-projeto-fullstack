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

// POST - criar usuario
router.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body
  db.run('INSERT INTO users (username ,password , email, phone) VALUES (?,?,?,?)', [username, password, email, phone], (err) => {
    if (err) {
      console.log("Erro ao criar o usuário", err)
      return res.status(500).json({ error: 'erro ao criar o usuário' })
    } else {
      res.status(201).json({ mensagem: "usuário cadastrado com sucesso" })
    }
  })
})

// GET - listar todos
router.get('/', function (req, res, next) {
  db.all('SELECT * FROM users', (err, users) => {
    if (err) {
      console.log("erro ao buscar usuarios", err)
      return res.status(500).json({ error: "usuarios nao encontrados" })
    } else {
      res.status(200).json(users)
    }
  })
});

// GET - por id
router.get('/:id', function (req, res) {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id=?', [id], (err, row) => {
    if (err) {
      console.error('erro ao buscar usuario', err);
      return res.status(500).json({ error: 'usuario nao encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'usuario nao encontrado' });
    }
    res.status(200).json(row);
  });
});

// PUT - atualizar usuario
router.put('/:id', function (req, res) {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;
  
  console.log('Atualizando usuário:', id);
  console.log('Dados recebidos:', { username, password, email, phone });

  db.run(
    'UPDATE users SET username=?, password=?, email=?, phone=? WHERE id=?',
    [username, password, email, phone, id],
    function(err) {
      if (err) {
        console.error('erro ao atualizar usuario', err);
        return res.status(500).json({ error: 'erro ao atualizar usuario' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'usuario nao encontrado' });
      }

      console.log('Usuário atualizado com sucesso');
      res.status(200).json({ mensagem: 'usuario atualizado com sucesso' });
    }
  );
});

// DELETE - deletar usuario
router.delete('/:id', function (req, res) {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id=?', [id], (err, row) => {
    if (err) {
      console.error('erro ao buscar usuario', err);
      return res.status(500).json({ error: 'erro ao deletar usuario' });
    }

    if (!row) {
      return res.status(404).json({ error: 'usuario nao encontrado' });
    }

    db.run('DELETE FROM users WHERE id=?', [id], (err) => {
      if (err) {
        console.error('erro ao deletar usuario', err);
        return res.status(500).json({ error: 'erro ao deletar usuario' });
      }

      res.status(200).json({ mensagem: 'usuario deletado com sucesso' });
    });
  });
});

module.exports = router;