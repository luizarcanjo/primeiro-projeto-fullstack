var express = require('express');
var router = express.Router();
const API_URL = "http://localhost:3000/pets";

router.get('/', function (req, res) {
  fetch(API_URL, { method: 'GET' })
    .then(async (response) => {
      if(!response.ok) throw await response.json();
      return response.json();
    })
    .then((pets) => {
      res.render('pets', { 
        title: 'Gestão de Pets',
        pets: pets,
        error: "" 
      });
    })
    .catch((error) => {
      console.log('erro ao buscar pets', error);
      res.render('pets', { 
        title: 'Gestão de Pets',
        pets: [],
        error: "Erro ao carregar pets" 
      });
    });
});

router.post('/', function (req, res) {
  const { name, type, race, colour, gender } = req.body;
  
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, race, colour, gender })
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Erro ao criar pet' });
    });
});

router.get('/:id', function (req, res) {
  const { id } = req.params;
  
  fetch(`${API_URL}/${id}`, { method: 'GET' })
    .then(async (response) => {
      if(!response.ok) throw await response.json();
      return response.json();
    })
    .then((pet) => {
      res.json(pet);
    })
    .catch((error) => {
      res.status(404).json({ error: 'Pet não encontrado' });
    });
});

router.put('/:id', function (req, res) {
  const { id } = req.params;
  const { name, type, race, colour, gender } = req.body;
  
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, race, colour, gender })
  })
    .then(async (response) => {
      if(!response.ok) throw await response.json();
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Erro ao atualizar pet' });
    });
});

router.delete('/:id', function (req, res) {
  const { id } = req.params;
  
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(async (response) => {
      if(!response.ok) throw await response.json();
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Erro ao deletar pet' });
    });
});

module.exports = router;