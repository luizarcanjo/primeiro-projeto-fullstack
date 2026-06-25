// Rotas de agendamentos no frontend - [Seu Nome]
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('agendamentos', { title: 'Agendamentos' });
});

module.exports = router;