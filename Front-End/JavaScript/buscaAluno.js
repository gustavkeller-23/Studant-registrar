import { alunosAPI } from './api.js';

// Função para criar um card de aluno
function criarCardAluno(aluno) {
    const card = document.createElement('div');
    card.className = 'cardAluno';

    // Define a imagem padrão se não houver foto
    const fotoSrc = aluno.foto || '../assets/default-avatar.png';

    card.innerHTML = `
        <div class="fotoAluno">
            <img src="${fotoSrc}" alt="Foto de ${aluno.nome}" onerror="this.src='../assets/default-avatar.png'" />
        </div>
        <div class="infoAluno">
            <div class="infoItem">
                <span class="labelInfo">NOME:</span>
                <span class="valorInfo">${aluno.nome}</span>
            </div>
            <div class="infoItem">
                <span class="labelInfo">DATA DE NASCIMENTO:</span>
                <span class="valorInfo">${aluno.dataNascimento}</span>
            </div>
            <div class="infoItem">
                <span class="labelInfo">CPF:</span>
                <span class="valorInfo">${aluno.cpf}</span>
            </div>
            <div class="infoItem">
                <span class="labelInfo">CURSO:</span>
                <span class="valorInfo">${aluno.curso}</span>
            </div>
            <div class="infoItem">
                <span class="labelInfo">SEXO:</span>
                <span class="valorInfo">${aluno.sexo}</span>
            </div>
            <div class="infoItem">
                <span class="labelInfo">TURNO:</span>
                <span class="valorInfo">${aluno.turno}</span>
            </div>
        </div>
    `;

    return card;
}

// Função para exibir mensagem quando não há alunos
function exibirMensagemVazia(mensagem) {
    const container = document.getElementById('containerCards');
    container.innerHTML = `
        <div style="text-align: center; color: white; font-size: 1.2rem; padding: 2rem; width: 100%;">
            ${mensagem}
        </div>
    `;
}

// Função para carregar e exibir os alunos
async function carregarAlunos() {
    try {
        const alunos = await alunosAPI.listar();
        const container = document.getElementById('containerCards');

        if (alunos.length === 0) {
            exibirMensagemVazia('Nenhum aluno matriculado ainda.');
            return;
        }

        container.innerHTML = '';

        alunos.forEach(aluno => {
            const card = criarCardAluno(aluno);
            container.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar alunos:', erro);
        exibirMensagemVazia('Erro ao carregar alunos. Verifique se o servidor está rodando.');
    }
}

// Função para filtrar alunos
async function filtrarAlunos() {
    try {
        const termoBusca = document.getElementById('inputBusca').value.trim();
        const turnoSelecionado = document.getElementById('filtroTurno').value;
        const cursoSelecionado = document.getElementById('filtroCurso').value;

        const filtros = {};
        if (termoBusca) filtros.nome = termoBusca;
        if (turnoSelecionado) filtros.turno = turnoSelecionado;
        if (cursoSelecionado) filtros.curso = cursoSelecionado;

        const alunos = await alunosAPI.listar(filtros);
        const container = document.getElementById('containerCards');

        if (alunos.length === 0) {
            exibirMensagemVazia('Nenhum aluno encontrado com os filtros selecionados.');
            return;
        }

        container.innerHTML = '';

        alunos.forEach(aluno => {
            const card = criarCardAluno(aluno);
            container.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao filtrar alunos:', erro);
        exibirMensagemVazia('Erro ao buscar alunos. Tente novamente.');
    }
}

// Event listeners para os filtros
document.getElementById('btnBuscar').addEventListener('click', filtrarAlunos);

document.getElementById('inputBusca').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        filtrarAlunos();
    }
});

// Filtro em tempo real ao digitar
document.getElementById('inputBusca').addEventListener('input', filtrarAlunos);

document.getElementById('filtroTurno').addEventListener('change', filtrarAlunos);

document.getElementById('filtroCurso').addEventListener('change', filtrarAlunos);

// Carrega os alunos ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAlunos);