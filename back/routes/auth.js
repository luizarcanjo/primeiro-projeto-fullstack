// Autenticação JWT - Admin/Gestores - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela admins (gestores/funcionários) - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS admins(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    role TEXT DEFAULT 'admin'
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela admins:', err);
  } else {
    console.log('Tabela admins pronta!');
  }
});

// POST - Registrar novo admin - [Seu Nome]
router.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios: username, password, email' });
  }

  // Hash da senha - [Seu Nome]
  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.run(
    'INSERT INTO admins (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)',
    [username, hashedPassword, email, phone, 'admin'],
    (err) => {
      if (err) {
        console.error('Erro ao registrar:', err);
        return res.status(500).json({ error: 'Erro ao registrar admin' });
      }
      res.status(201).json({ message: 'Admin registrado com sucesso' });
    }
  );
});

// POST - Login de admin - [Seu Nome]
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }

  // Buscar admin - [Seu Nome]
  db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar admin' });
    }

    if (!admin) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Validar senha - [Seu Nome]
    const isValidPassword = bcryptjs.compareSync(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT token - [Seu Nome]
    const token = jwt.sign(
      { id: admin.id, email: admin.email, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token: token,
      admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role }
    });
  });
});

module.exports = router;