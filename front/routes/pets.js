var express = require('express');
var router = express.Router();
const API_URL = "http://localhost:3000/pets";
const USERS_API_URL = "http://localhost:3000/users";

// GET - Listar pets e usuários para o dropdown
router.get('/', function (req, res) {
  Promise.all([
    fetch(API_URL)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar pets');
        return response.json();
      })
      .catch(err => {
        console.error('Erro fetch pets:', err);
        return [];
      }),
    fetch(USERS_API_URL)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return response.json();
      })
      .catch(err => {
        console.error('Erro fetch usuários:', err);
        return [];
      })
  ])
    .then(([pets, users]) => {
      // Garante que são arrays
      const petsArray = Array.isArray(pets) ? pets : [];
      const usersArray = Array.isArray(users) ? users : [];
      
      res.render('pets', { 
        title: 'Gestão de Pets',
        pets: petsArray,
        users: usersArray,
        error: "" 
      });
    })
    .catch((error) => {
      console.log('erro ao buscar dados', error);
      res.render('pets', { 
        title: 'Gestão de Pets',
        pets: [],
        users: [],
        error: "Erro ao carregar dados" 
      });
    });
});

// POST - Criar pet com tutor
router.post('/', function (req, res) {
  const { name, type, race, colour, gender, user_id } = req.body;
  
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, race, colour, gender, user_id })
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

// GET - Pet por ID
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

// PUT - Atualizar pet com tutor
router.put('/:id', function (req, res) {
  const { id } = req.params;
  const { name, type, race, colour, gender, user_id } = req.body;
  
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, race, colour, gender, user_id })
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

// DELETE - Deletar pet
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