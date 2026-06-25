// Rotas da página inicial - [Seu Nome]
var express = require('express');
var router = express.Router();

// Middleware para verificar autenticação - [Seu Nome]
const verificarAutenticacao = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  next();
};

// Rotas públicas - [Seu Nome]
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

// Rotas protegidas - [Seu Nome]
router.get('/', verificarAutenticacao, (req, res) => {
  res.render('index', { title: 'Petshop' });
});

module.exports = router;