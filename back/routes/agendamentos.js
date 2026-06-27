// CRUD de Agendamentos - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var verifyToken = require('../middleware/auth');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela agendamentos - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS agendamentos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    servico_id INTEGER,
    customer_id INTEGER,
    data_hora TEXT,
    status TEXT DEFAULT 'pendente',
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela agendamentos:', err);
  } else {
    console.log('Tabela agendamentos pronta!');
  }
});

// GET - Listar todos os agendamentos (protegido) - [Seu Nome]
router.get('/', verifyToken, (req, res) => {
  const sql = `
    SELECT a.*, p.name as pet_name, s.name as servico_name, c.username as tutor_name
    FROM agendamentos a
    LEFT JOIN pets p ON a.pet_id = p.id
    LEFT JOIN servicos s ON a.servico_id = s.id
    LEFT JOIN customers c ON a.customer_id = c.id
    ORDER BY a.data_hora DESC
  `;

  db.all(sql, (err, agendamentos) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
    res.status(200).json(agendamentos);
  });
});

// GET - Por ID - [Seu Nome]
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT a.*, p.name as pet_name, s.name as servico_name, c.username as tutor_name
    FROM agendamentos a
    LEFT JOIN pets p ON a.pet_id = p.id
    LEFT JOIN servicos s ON a.servico_id = s.id
    LEFT JOIN customers c ON a.customer_id = c.id
    WHERE a.id = ?
  `;

  db.get(sql, [id], (err, agendamento) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(agendamento);
  });
});

// POST - Criar agendamento (protegido) - [Seu Nome]
router.post('/', verifyToken, (req, res) => {
  const { pet_id, servico_id, customer_id, data_hora } = req.body;

  if (!pet_id || !servico_id || !customer_id || !data_hora) {
    return res.status(400).json({ error: 'Campos obrigatórios: pet_id, servico_id, customer_id, data_hora' });
  }

  db.run(
    'INSERT INTO agendamentos (pet_id, servico_id, customer_id, data_hora, status) VALUES (?, ?, ?, ?, ?)',
    [pet_id, servico_id, customer_id, data_hora, 'pendente'],
    (err) => {
      if (err) {
        console.error('Erro ao criar agendamento:', err);
        return res.status(500).json({ error: 'Erro ao criar agendamento' });
      }
      res.status(201).json({ message: 'Agendamento criado com sucesso' });
    }
  );
});

// PUT - Atualizar agendamento (protegido) - [Seu Nome]
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { pet_id, servico_id, customer_id, data_hora, status } = req.body;

  db.run(
    'UPDATE agendamentos SET pet_id = ?, servico_id = ?, customer_id = ?, data_hora = ?, status = ? WHERE id = ?',
    [pet_id, servico_id, customer_id, data_hora, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      res.status(200).json({ message: 'Agendamento atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar agendamento (protegido) - [Seu Nome]
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM agendamentos WHERE id = ?', [id], (err, agendamento) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar agendamento' });
    }
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    db.run('DELETE FROM agendamentos WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar agendamento' });
      }
      res.status(200).json({ message: 'Agendamento deletado com sucesso' });
    });
  });
});

module.exports = router;