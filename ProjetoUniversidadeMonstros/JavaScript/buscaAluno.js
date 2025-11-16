// buscaAluno.js

// Função para criar um card de aluno
function criarCardAluno(aluno) {
    const card = document.createElement('div');
    card.className = 'cardAluno';
    
    // Define a imagem padrão se não houver foto
    const fotoSrc = aluno.foto || '../images/default-avatar.png';
    
    card.innerHTML = `
        <div class="fotoAluno">
            <img src="${fotoSrc}" alt="Foto de ${aluno.nome}" onerror="this.src='../images/default-avatar.png'" />
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
function carregarAlunos() {
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
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
}

// Função para filtrar alunos
function filtrarAlunos() {
    const termoBusca = document.getElementById('inputBusca').value.toLowerCase().trim();
    const turnoSelecionado = document.getElementById('filtroTurno').value;
    const cursoSelecionado = document.getElementById('filtroCurso').value;
    
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    
    // Aplica os filtros
    const alunosFiltrados = alunos.filter(aluno => {
        // Filtro por nome
        const nomeMatch = aluno.nome.toLowerCase().includes(termoBusca);
        
        // Filtro por turno
        const turnoMatch = !turnoSelecionado || aluno.turno === turnoSelecionado;
        
        // Filtro por curso
        const cursoMatch = !cursoSelecionado || aluno.curso === cursoSelecionado;
        
        return nomeMatch && turnoMatch && cursoMatch;
    });
    
    const container = document.getElementById('containerCards');
    
    if (alunosFiltrados.length === 0) {
        exibirMensagemVazia('Nenhum aluno encontrado com os filtros selecionados.');
        return;
    }
    
    container.innerHTML = '';
    
    alunosFiltrados.forEach(aluno => {
        const card = criarCardAluno(aluno);
        container.appendChild(card);
    });
}

// Event listeners para os filtros
document.getElementById('btnBuscar').addEventListener('click', filtrarAlunos);

document.getElementById('inputBusca').addEventListener('keyup', function(e) {
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

console.log('Total de alunos cadastrados:', JSON.parse(localStorage.getItem('alunos') || '[]').length);