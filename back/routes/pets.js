var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./database/database.db');

// Criar tabela pets
db.run(`
  CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    race TEXT,
    colour TEXT,
    gender TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela pets:', err);
  } else {
    console.log('Tabela pets criada com sucesso!');
  }
});

// POST - Criar pet
router.post('/', (req, res) => {
  const { name, type, race, colour, gender } = req.body;

  db.run(
    'INSERT INTO pets (name, type, race, colour, gender) VALUES (?, ?, ?, ?, ?)',
    [name, type, race, colour, gender],
    (err) => {
      if (err) {
        console.error('Erro ao cadastrar pet:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar pet' });
      }
      res.status(201).json({ message: 'Pet cadastrado com sucesso' });
    }
  );
});

// GET - Listar todos
router.get('/', (req, res) => {
  db.all('SELECT * FROM pets', (err, pets) => {
    if (err) {
      console.error('Erro ao buscar pets:', err);
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
    res.status(200).json(pets);
  });
});

// GET - Por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar pet:', err);
      return res.status(500).json({ error: 'Erro ao buscar pet' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    res.status(200).json(row);
  });
});

// PUT - Atualizar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, race, colour, gender } = req.body;

  db.run(
    'UPDATE pets SET name = ?, type = ?, race = ?, colour = ?, gender = ? WHERE id = ?',
    [name, type, race, colour, gender, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar pet:', err);
        return res.status(500).json({ error: 'Erro ao atualizar pet' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pet não encontrado' });
      }
      res.status(200).json({ message: 'Pet atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar pet:', err);
      return res.status(500).json({ error: 'Erro ao deletar pet' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    db.run('DELETE FROM pets WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Erro ao deletar pet:', err);
        return res.status(500).json({ error: 'Erro ao deletar pet' });
      }
      res.status(200).json({ message: 'Pet deletado com sucesso' });
    });
  });
});

module.exports = router;