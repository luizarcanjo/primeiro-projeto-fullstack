// Rotas de customers (donos de pets) - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyToken = require('../middleware/auth');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela customers - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS customers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela customers:', err);
  } else {
    console.log('Tabela customers pronta!');
  }
});

// GET - Listar todos os customers (protegido) - [Seu Nome]
router.get('/', verifyToken, (req, res) => {
  db.all('SELECT * FROM customers', (err, customers) => {
    if (err) {
      console.error('Erro ao buscar customers:', err);
      return res.status(500).json({ error: 'Erro ao buscar customers' });
    }
    res.status(200).json(customers);
  });
});

// GET - Customer por ID (protegido) - [Seu Nome]
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar customer' });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer não encontrado' });
    }
    res.status(200).json(customer);
  });
});

// POST - Criar customer (protegido) - [Seu Nome]
router.post('/', verifyToken, (req, res) => {
  const { username, email, phone } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios: username, email' });
  }

  db.run(
    'INSERT INTO customers (username, email, phone) VALUES (?, ?, ?)',
    [username, email, phone],
    (err) => {
      if (err) {
        console.error('Erro ao criar customer:', err);
        return res.status(500).json({ error: 'Erro ao criar customer' });
      }
      res.status(201).json({ message: 'Customer criado com sucesso' });
    }
  );
});

// PUT - Atualizar customer (protegido) - [Seu Nome]
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { username, email, phone } = req.body;

  db.run(
    'UPDATE customers SET username = ?, email = ?, phone = ? WHERE id = ?',
    [username, email, phone, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar customer' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Customer não encontrado' });
      }
      res.status(200).json({ message: 'Customer atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar customer (protegido) - [Seu Nome]
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar customer' });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer não encontrado' });
    }

    db.run('DELETE FROM customers WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar customer' });
      }
      res.status(200).json({ message: 'Customer deletado com sucesso' });
    });
  });
});

module.exports = router;