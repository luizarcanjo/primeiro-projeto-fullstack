// Rotas de customers (donos de pets) - [Seu Nome]
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

// GET - Página de customers (protegida) - [Seu Nome]
router.get('/', verificarAutenticacao, (req, res) => {
  res.render('customers', { title: 'Customers' });
});

module.exports = router;