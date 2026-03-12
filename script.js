$(document).ready(function () {

    // --- LISTAR PROFESSORES (GET) ---
    $.getJSON("https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/professores", function (dados) {
        const $listaProf = $("#listaProf"); // Seleção com jQuery
        $listaProf.empty(); // Limpa a lista (igual ao innerHTML = "")

        $.each(dados, function (i, professor) {
            const item = $("<li>").text(`${professor.id} - ${professor.nome} - ${professor.idade} anos - ${professor.cadeira}`);
            $listaProf.append(item); // Adiciona na lista
        });
    }).fail(err => console.error("Erro ao buscar professores:", err));

    // --- LISTAR ALUNOS (GET) ---
    $.getJSON("https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/alunos", function (dados) {
        const $listaAlunos = $("#listaAlunos");
        $listaAlunos.empty();

        $.each(dados, function (i, aluno) {
            const item = $("<li>").text(`${aluno.id} - ${aluno.nome} - ${aluno.idade} anos - ${aluno.sexo} - ${aluno.curso}`);
            $listaAlunos.append(item);
        });
    }).fail(err => console.error("Erro ao buscar alunos:", err));

    // --- POST DO FORMULÁRIO DE ALUNOS ---
    $("#form-alunos").on("submit", function (event) {
        event.preventDefault();

        // Pegando os dados com .val()
        const dadosAlunos = {
            nome: $("#nome_comp").val(),
            idade: $("#idade").val(),
            sexo: $("#sexo").val(),
            curso: $("#curso").val()
        };

        // Enviando os dados via POST
        $.ajax({
            url: "https://miniature-space-guide-5wprjqv56v7h4q96-3000.app.github.dev/alunos",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(dadosAlunos),
            success: function (novoAluno) {
                alert("Aluno cadastrado com sucesso!");
                $("#form-alunos")[0].reset(); // Limpa o formulário
                location.reload(); // Recarrega para mostrar o novo aluno na lista
            },
            error: function (erro) {
                console.error("Erro ao cadastrar aluno:", erro);
            }
        });
    });

});