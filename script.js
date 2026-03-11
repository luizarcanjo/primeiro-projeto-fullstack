fetch("https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/professores")
    .then((response) => response.json())
    .then((data) => {

        const listaProfessores = document.getElementById("listaProf");

        listaProfessores.innerHTML = "";


        data.forEach(professor => {
            const item = document.createElement("li");
            item.textContent = professor.id + " - " + professor.nome + " - " + professor.idade + " anos - " + professor.cadeira;
            //listaProfessores.appendChild(item);
        });
    })
    .catch(error => console.error("Erro na requisição:", error));

fetch("https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/alunos")
    .then((response) => response.json())
    .then((data) => {

        const listaAlunos = document.getElementById("listaAlunos");

        listaAlunos.innerHTML = "";


        data.forEach(alunos => {
            const item = document.createElement("li");
            item.textContent = alunos.id + " - " + alunos.nome + " - " + alunos.idade + " anos - " + alunos.sexo + " - " + alunos.curso;
            //listaAlunos.appendChild(item);
        });
    })
    .catch(error => console.error("Erro na requisição:", error));

const formAlunos = document.getElementById("form-alunos");
formAlunos.addEventListener("submit", function (event) {
    event.preventDefault();

    const dadosAlunos = {
        nome: document.getElementById("nome_comp").value,
        idade: document.getElementById("idade").value,
        sexo: document.getElementById("sexo").value,
        curso: document.getElementById("curso").value
    };
});
/*fetch("https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/alunos", {
method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosAluno)
    })
    .then(res => res.json())
    .then(data => {
        alert("Aluno cadastrado com sucesso!");
        formAluno.reset(); 
        })
    .catch(erro => console.error("Erro ao enviar:", erro));*/