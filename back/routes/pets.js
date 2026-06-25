// CRUD de Pets - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyToken = require('../middleware/auth');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela pets com referência a customers - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    race TEXT,
    colour TEXT,
    gender TEXT,
    customer_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela pets:', err);
  } else {
    console.log('Tabela pets pronta!');
  }
});

// GET - Listar todos os pets (protegido) - [Seu Nome]
router.get('/', verifyToken, (req, res) => {
  const sql = `
    SELECT p.*, c.username as customer_name
    FROM pets p
    LEFT JOIN customers c ON p.customer_id = c.id
  `;

  db.all(sql, (err, pets) => {
    if (err) {
      console.error('Erro ao buscar pets:', err);
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
    res.status(200).json(pets);
  });
});

// GET - Pet por ID (protegido) - [Seu Nome]
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, c.username as customer_name
    FROM pets p
    LEFT JOIN customers c ON p.customer_id = c.id
    WHERE p.id = ?
  `;

  db.get(sql, [id], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar pet' });
    }
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    res.status(200).json(pet);
  });
});

// GET - Pets de um customer específico (protegido) - [Seu Nome]
router.get('/customer/:customer_id', verifyToken, (req, res) => {
  const { customer_id } = req.params;

  const sql = `
    SELECT p.*, c.username as customer_name
    FROM pets p
    LEFT JOIN customers c ON p.customer_id = c.id
    WHERE p.customer_id = ?
  `;

  db.all(sql, [customer_id], (err, pets) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
    res.status(200).json(pets);
  });
});

// POST - Criar pet (protegido) - [Seu Nome]
router.post('/', verifyToken, (req, res) => {
  const { name, type, race, colour, gender, customer_id } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, type' });
  }

  db.run(
    'INSERT INTO pets (name, type, race, colour, gender, customer_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, race, colour, gender, customer_id],
    (err) => {
      if (err) {
        console.error('Erro ao criar pet:', err);
        return res.status(500).json({ error: 'Erro ao criar pet' });
      }
      res.status(201).json({ message: 'Pet criado com sucesso' });
    }
  );
});

// PUT - Atualizar pet (protegido) - [Seu Nome]
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, type, race, colour, gender, customer_id } = req.body;

  db.run(
    'UPDATE pets SET name = ?, type = ?, race = ?, colour = ?, gender = ?, customer_id = ? WHERE id = ?',
    [name, type, race, colour, gender, customer_id, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar pet' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pet não encontrado' });
      }
      res.status(200).json({ message: 'Pet atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar pet (protegido) - [Seu Nome]
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM pets WHERE id = ?', [id], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar pet' });
    }
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    db.run('DELETE FROM pets WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar pet' });
      }
      res.status(200).json({ message: 'Pet deletado com sucesso' });
    });
  });
});

module.exports = router;