var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./database/database.db');

// criando tabela pets
db.run(`
  CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    race TEXT,
    colour TEXT,
    gender TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pets:', err);
  } else {
    console.log('Tabela pets criada com sucesso!');
  }
});

// criar pet
router.post('/', (req, res) => {
  const { name, race, colour, gender } = req.body;

  db.run(
    'INSERT INTO pets (name, race, colour, gender) VALUES (?, ?, ?, ?)',
    [name, race, colour, gender],
    (err) => {
      if (err) {
        console.error('Erro ao cadastrar pet:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar pet' });
      }

      res.status(201).json({
        message: 'Pet cadastrado com sucesso'
      });
    }
  );
});

// listar todos os pets
router.get('/', (req, res) => {
  db.all('SELECT * FROM pets', (err, pets) => {
    if (err) {
      console.error('Erro ao buscar pets:', err);
      return res.status(500).json({
        error: 'Pets não encontrados'
      });
    }

    res.status(200).json(pets);
  });
});

// buscar pet por id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM pets WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        console.error('Erro ao buscar pet:', err);
        return res.status(500).json({
          error: 'Erro ao buscar pet'
        });
      }

      if (!row) {
        return res.status(404).json({
          error: 'Pet não encontrado'
        });
      }

      res.status(200).json(row);
    }
  );
});

module.exports = router;