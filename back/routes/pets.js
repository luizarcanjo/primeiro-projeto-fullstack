var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./database/database.db');

// Criar tabela pets com user_id
db.run(`
  CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    race TEXT,
    colour TEXT,
    gender TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela pets:', err);
  } else {
    console.log('Tabela pets criada com sucesso!');
  }
});

// POST - Criar pet com tutor
router.post('/', (req, res) => {
  const { name, type, race, colour, gender, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id é obrigatório' });
  }

  db.run(
    'INSERT INTO pets (name, type, race, colour, gender, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, race, colour, gender, user_id],
    (err) => {
      if (err) {
        console.error('Erro ao cadastrar pet:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar pet' });
      }
      res.status(201).json({ message: 'Pet cadastrado com sucesso' });
    }
  );
});

// GET - Listar todos com dados do tutor
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, u.username as tutor_name
    FROM pets p
    LEFT JOIN users u ON p.user_id = u.id
  `;

  db.all(sql, (err, pets) => {
    if (err) {
      console.error('Erro ao buscar pets:', err);
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
    res.status(200).json(pets);
  });
});

// GET - Pets de um usuário específico
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT p.*, u.username as tutor_name
    FROM pets p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
  `;

  db.all(sql, [user_id], (err, pets) => {
    if (err) {
      console.error('Erro ao buscar pets do usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
    res.status(200).json(pets);
  });
});

// GET - Pet por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, u.username as tutor_name
    FROM pets p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  db.get(sql, [id], (err, row) => {
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

// PUT - Atualizar pet
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, race, colour, gender, user_id } = req.body;

  const sql = `
    UPDATE pets 
    SET name = ?, type = ?, race = ?, colour = ?, gender = ?, user_id = ?
    WHERE id = ?
  `;

  db.run(sql, [name, type, race, colour, gender, user_id, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar pet:', err);
      return res.status(500).json({ error: 'Erro ao atualizar pet' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    res.status(200).json({ message: 'Pet atualizado com sucesso' });
  });
});

// DELETE - Deletar pet
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