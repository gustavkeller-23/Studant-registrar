import { alunosAPI } from './api.js';

// Script simples para a página de editar aluno
document.addEventListener('DOMContentLoaded', function () {
  const buscarBtn = document.getElementById('buscarAluno');
  const form = document.getElementById('formEditarAluno');

  // normaliza string removendo acentos e convertendo para minúsculas
  function normalizeString(s) {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }

  // Limpa campos do formulário de edição
  function clearForm() {
    const query = document.getElementById('queryAluno');
    const nome = document.getElementById('nomeAluno');
    const curso = document.getElementById('cursoAluno');
    const ano = document.getElementById('anoAluno');
    const found = document.getElementById('foundId');
    const foto = document.getElementById('fotoAlunoPreview');
    if (query) query.value = '';
    if (nome) nome.value = '';
    if (curso) curso.value = '';
    if (ano) ano.value = '';
    if (found) found.value = '';
    if (foto) { foto.src = ''; foto.style.display = 'none'; }
  }

  buscarBtn.addEventListener('click', async function () {
    const query = document.getElementById('queryAluno').value.trim();
    if (!query) {
      alert('Informe o nome (ou parte do nome) do aluno para buscar.');
      return;
    }

    try {
      // Busca alunos por nome usando a API
      const alunos = await alunosAPI.listar({ nome: query });

      if (alunos.length > 0) {
        const found = alunos[0]; // Pega o primeiro resultado

        document.getElementById('nomeAluno').value = found.nome || '';
        document.getElementById('cursoAluno').value = found.curso || '';
        // Ano pode não existir no cadastro original; preenche se houver
        document.getElementById('anoAluno').value = found.ano || '';
        document.getElementById('foundId').value = found.id || '';

        // Preenche foto se existir
        const fotoEl = document.getElementById('fotoAlunoPreview');
        if (fotoEl) {
          if (found.foto) {
            fotoEl.src = found.foto;
            fotoEl.style.display = 'block';
          } else {
            fotoEl.src = '';
            fotoEl.style.display = 'none';
          }
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

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const foundId = document.getElementById('foundId').value.trim();
    const nome = document.getElementById('nomeAluno').value.trim();
    const curso = document.getElementById('cursoAluno').value.trim();
    const ano = document.getElementById('anoAluno').value.trim();

    if (!nome) {
      alert('O nome não pode ficar vazio.');
      return;
    }

    if (!foundId) {
      alert('Busque um aluno antes de tentar atualizar.');
      return;
    }

    try {
      // Prepara dados para atualização
      const dadosAtualizados = {
        nome,
        curso
      };

      if (ano) dadosAtualizados.ano = ano;

      // Atualiza usando a API
      await alunosAPI.atualizar(foundId, dadosAtualizados);

      alert('Alterações salvas para: ' + nome);
      window.location.href = 'bemVindoProf.html';
    } catch (erro) {
      console.error('Erro ao atualizar aluno:', erro);
      alert(erro.message || 'Erro ao atualizar aluno. Tente novamente.');
    }
  });

  // Handler de exclusão — botão dentro da página de editar
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
        await alunosAPI.deletar(foundId);
        clearForm();
        alert('Aluno excluído: ' + nomeAluno);
        window.location.href = 'bemVindoProf.html';
      } catch (erro) {
        console.error('Erro ao excluir aluno:', erro);
        alert(erro.message || 'Erro ao excluir aluno. Tente novamente.');
      }
    });
  }
});
