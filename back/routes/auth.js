// Autenticação JWT - [Seu Nome]
var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');

const db = new sqlite3.Database('./database/database.db');

// Criar tabela users com senha - [Seu Nome]
db.run(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela users:', err);
  } else {
    console.log('Tabela users pronta!');
  }
});

// POST - Registrar novo usuário - [Seu Nome]
router.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios: username, password, email' });
  }

  // Hash da senha - [Seu Nome]
  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, email, phone],
    (err) => {
      if (err) {
        console.error('Erro ao registrar:', err);
        return res.status(500).json({ error: 'Erro ao registrar usuário' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
  );
});

// POST - Login - [Seu Nome]
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }

  // Buscar usuário - [Seu Nome]
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Validar senha - [Seu Nome]
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT token - [Seu Nome]
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token: token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});

module.exports = router;