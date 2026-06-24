var express = require('express');
var router = express.Router();
const API_URL = "https://fluffy-tribble-vx7r9vp5v7j2579-4000.app.github.dev/users"

/* GET - Renderizar página com usuários */
router.get('/', function (req, res, next) {
  fetch(API_URL, { method: 'GET' })
    .then(async (res) => {
      if(!res.ok){
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((users) => {
      let title = "Gestão de usuários"
      let cols = ["id", "Nome", "Senha", "Email", "Telefone", "Ações"]
      res.render('users', { title, users, cols, error: "" })
    })
    .catch((error) => {
      console.log('erro ao buscar usuários', error)
      let title = "Gestão de usuários"
      let cols = ["id", "Nome", "Senha", "Email", "Telefone", "Ações"]
      res.render('users', { title, users: [], cols, error: "Erro ao carregar usuários" })
    })
});

/* POST - Criar usuário */
router.post('/register', function (req, res) {
  const { username, password, email, phone } = req.body;
  
  fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, phone })
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    })
    .then((data) => {
      console.log('Usuário criado:', data);
      res.status(201).json(data);
    })
    .catch((error) => {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    });
});

/* GET - Buscar usuário por ID */
router.get('/:id', function (req, res) {
  const { id } = req.params;
  
  fetch(`${API_URL}/${id}`, { method: 'GET' })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    })
    .then((user) => {
      console.log('Usuário encontrado:', user);
      res.json(user);
    })
    .catch((error) => {
      console.error('Erro ao buscar usuário:', error);
      res.status(404).json({ error: 'Usuário não encontrado' });
    });
});

/* PUT - Atualizar usuário */
router.put('/:id', function (req, res) {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;
  
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, phone })
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    })
    .then((data) => {
      console.log('Usuário atualizado:', data);
      res.json(data);
    })
    .catch((error) => {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    });
});

/* DELETE - Deletar usuário */
router.delete('/:id', function (req, res) {
  const { id } = req.params;
  console.log('Deletando usuário ID:', id);
  
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    })
    .then((data) => {
      console.log('Usuário deletado:', data);
      res.json(data);
    })
    .catch((error) => {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    });
});

module.exports = router;