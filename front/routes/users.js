var express = require('express');
var router = express.Router();
const url = "https://fluffy-tribble-vx7r9vp5v7j2579-4000.app.github.dev/users"

/* GET users listing. */
router.get('/', function (req, res, next) {

  fetch(url, { method: 'GET' })
    .then(async (res) => {
      if(!res.ok){
        const err = await res.json()
        throw err
      }
      return res.json()
    })
    .then((users) => {
      let title = "Gestão de usuários"
      let cols=["Nome","Senha","Email","Telefone","Acões"]
      res.render('users', { title ,users, cols, error: ""})
    })
    .catch((error) => {
      console.log('erro',error)
      res.status(500).send("Erro ao buscar usuários", error)
    })
  
});

module.exports = router;
