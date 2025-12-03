import { alunosAPI } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
    const buscarBtn = document.getElementById('buscarAluno');
    const form = document.getElementById('formEditarAluno');

    // Limpa campos do formulário
    function clearForm() {
        const query = document.getElementById('queryAluno');
        const nome = document.getElementById('nomeAluno');
        const curso = document.getElementById('cursoAluno');
        const turno = document.getElementById('turnoAluno');
        const ano = document.getElementById('anoAluno');
        const found = document.getElementById('foundId');
        
        // Campos de foto
        const fotoEl = document.getElementById('fotoAlunoPreview');
        const fotoData = document.getElementById('fotoAlunoData');
        const inputFoto = document.getElementById('inputFotoEditar');

        if (query) query.value = '';
        if (nome) nome.value = '';
        if (curso) curso.value = '';
        if (turno) turno.value = '';
        if (ano) ano.value = '';
        if (found) found.value = '';
        
        if (fotoEl) { fotoEl.src = ''; fotoEl.style.display = 'none'; }
        if (fotoData) fotoData.value = '';
        if (inputFoto) inputFoto.value = '';
    }

    // --- LÓGICA DE BUSCA (BACKEND) ---
    buscarBtn.addEventListener('click', async function () {
        const query = document.getElementById('queryAluno').value.trim();
        
        if (!query) {
            alert('Informe o nome (ou parte do nome) do aluno para buscar.');
            return;
        }

        try {
            // Busca no Backend
            const alunos = await alunosAPI.listar({ nome: query });

            if (alunos.length > 0) {
                const found = alunos[0]; // Pega o primeiro encontrado

                document.getElementById('nomeAluno').value = found.nome || '';
                document.getElementById('cursoAluno').value = found.curso || '';
                
                // Preenche Turno (se existir no HTML e no objeto)
                const turnoEl = document.getElementById('turnoAluno');
                if (turnoEl) turnoEl.value = found.turno || '';

                // Preenche Ano (converte para string pois input number aceita string)
                document.getElementById('anoAluno').value = found.ano || '';
                document.getElementById('foundId').value = found.id || '';

                // --- LÓGICA DA FOTO (Base64 vindo do Banco) ---
                const fotoEl = document.getElementById('fotoAlunoPreview');
                const fotoData = document.getElementById('fotoAlunoData');

                if (fotoEl && found.foto) {
                    fotoEl.src = found.foto;
                    fotoEl.style.display = 'block';
                    if (fotoData) fotoData.value = found.foto;
                } else if (fotoEl) {
                    fotoEl.src = '';
                    fotoEl.style.display = 'none';
                    if (fotoData) fotoData.value = '';
                }

            } else {
                clearForm();
                alert('Aluno não encontrado.');
            }
        } catch (erro) {
            console.error('Erro ao buscar aluno:', erro);
            alert('Erro ao buscar aluno. Verifique se o servidor está rodando.');
        }
    });

    // --- LÓGICA DE UPLOAD DE FOTO (PREVIEW) ---
    const inputFotoEditar = document.getElementById('inputFotoEditar');
    if (inputFotoEditar) {
        inputFotoEditar.addEventListener('change', function (ev) {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result; // String Base64 da imagem
                
                const fotoEl = document.getElementById('fotoAlunoPreview');
                const fotoData = document.getElementById('fotoAlunoData');
                
                // Atualiza o visual
                if (fotoEl) { 
                    fotoEl.src = dataUrl; 
                    fotoEl.style.display = 'block'; 
                }
                // Atualiza o input hidden para enviar ao backend depois
                if (fotoData) fotoData.value = dataUrl;
            };
            reader.readAsDataURL(file);
        });
    }

    // --- LÓGICA DE REMOVER FOTO ---
    const removerFotoBtn = document.getElementById('removerFotoBtn');
    if (removerFotoBtn) {
        removerFotoBtn.addEventListener('click', function () {
            const fotoEl = document.getElementById('fotoAlunoPreview');
            const fotoData = document.getElementById('fotoAlunoData');
            const inputFoto = document.getElementById('inputFotoEditar');

            if (fotoEl) { fotoEl.src = ''; fotoEl.style.display = 'none'; }
            if (fotoData) fotoData.value = ''; // Limpa a string base64
            if (inputFoto) inputFoto.value = '';
        });
    }

    // --- LÓGICA DE SALVAR/ATUALIZAR (BACKEND) ---
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const foundId = document.getElementById('foundId').value.trim();
        const nome = document.getElementById('nomeAluno').value.trim();
        const curso = document.getElementById('cursoAluno').value.trim();
        const turno = document.getElementById('turnoAluno') ? document.getElementById('turnoAluno').value.trim() : '';
        const ano = document.getElementById('anoAluno').value.trim();
        const foto = document.getElementById('fotoAlunoData') ? document.getElementById('fotoAlunoData').value : '';

        if (!nome) {
            alert('O nome não pode ficar vazio.');
            return;
        }

        if (!foundId) {
            alert('Busque um aluno antes de tentar atualizar.');
            return;
        }

        try {
            // Monta o objeto para enviar ao Prisma
            const dadosAtualizados = {
                nome,
                curso,
                turno,
                foto: foto || null // Envia null se estiver vazio para limpar no banco
            };

            if (ano) dadosAtualizados.ano = parseInt(ano); // Converte para número se necessário, ou envie string dependendo do seu Schema

            // Chamada API Backend
            await alunosAPI.atualizar(foundId, dadosAtualizados);

            alert('Alterações salvas para: ' + nome);
            window.location.href = 'bemVindoProf.html';

        } catch (erro) {
            console.error('Erro ao atualizar aluno:', erro);
            alert(erro.message || 'Erro ao atualizar aluno. Tente novamente.');
        }
    });

    // --- LÓGICA DE EXCLUIR (BACKEND) ---
    const excluirBtn = document.getElementById('excluirAlunoBtn');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async function () {
            const foundId = document.getElementById('foundId').value.trim();
            const nomeAluno = document.getElementById('nomeAluno').value.trim();

            if (!foundId) {
                alert('Busque um aluno antes de tentar excluir.');
                return;
            }

            const confirmar = confirm(`Tem certeza que deseja excluir o aluno: ${nomeAluno}?`);
            if (!confirmar) return;

            try {
                // Chamada API Backend
                await alunosAPI.deletar(foundId);
                
                clearForm();
                alert('Aluno excluído com sucesso.');
                window.location.href = 'bemVindoProf.html';
            } catch (erro) {
                console.error('Erro ao excluir aluno:', erro);
                alert(erro.message || 'Erro ao excluir aluno. Tente novamente.');
            }
        });
    }
});