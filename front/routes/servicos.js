// Rotas de serviços no frontend 
var express = require('express');
var router = express.Router();

// GET - Página de serviços 
router.get('/', (req, res) => {
  res.render('servicos', { title: 'Serviços' });
});

module.exports = router;