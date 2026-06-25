// CRUD de Serviços - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyToken = require('../middleware/auth');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela serviços - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS servicos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela serviços:', err);
  } else {
    console.log('Tabela serviços pronta!');
  }
});

// GET - Listar todos os serviços (protegido) - [Seu Nome]
router.get('/', verifyToken, (req, res) => {
  db.all('SELECT * FROM servicos', (err, servicos) => {
    if (err) {
      console.error('Erro ao buscar serviços:', err);
      return res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
    res.status(200).json(servicos);
  });
});

// GET - Serviço por ID (protegido) - [Seu Nome]
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM servicos WHERE id = ?', [id], (err, servico) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.status(200).json(servico);
  });
});

// POST - Criar serviço (protegido) - [Seu Nome]
router.post('/', verifyToken, (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Nome e preço obrigatórios' });
  }

  db.run(
    'INSERT INTO servicos (name, description, price) VALUES (?, ?, ?)',
    [name, description, price],
    (err) => {
      if (err) {
        console.error('Erro ao criar serviço:', err);
        return res.status(500).json({ error: 'Erro ao criar serviço' });
      }
      res.status(201).json({ message: 'Serviço criado com sucesso' });
    }
  );
});

// PUT - Atualizar serviço (protegido) - [Seu Nome]
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  db.run(
    'UPDATE servicos SET name = ?, description = ?, price = ? WHERE id = ?',
    [name, description, price, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar serviço' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }
      res.status(200).json({ message: 'Serviço atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar serviço (protegido) - [Seu Nome]
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM servicos WHERE id = ?', [id], (err, servico) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    db.run('DELETE FROM servicos WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar serviço' });
      }
      res.status(200).json({ message: 'Serviço deletado com sucesso' });
    });
  });
});

module.exports = router;