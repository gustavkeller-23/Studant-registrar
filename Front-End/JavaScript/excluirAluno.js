import { alunosAPI } from './api.js';

// Script para excluir aluno
document.addEventListener('DOMContentLoaded', function () {
  const formExcluir = document.getElementById('formExcluirAluno');
  const buscarBtn = document.getElementById('buscarExcluir');
  const queryInput = document.getElementById('queryExcluir');
  const foundIdInput = document.getElementById('foundIdExcluir');
  const infoDiv = document.getElementById('infoEncontrado');

  // Buscar aluno
  buscarBtn.addEventListener('click', async function () {
    const query = queryInput.value.trim();

    if (!query) {
      alert('Digite um nome para buscar.');
      return;
    }

    try {
      const alunos = await alunosAPI.listar({ nome: query });

      if (alunos.length > 0) {
        const aluno = alunos[0];
        foundIdInput.value = aluno.id;
        infoDiv.textContent = `Encontrado: ${aluno.nome} - ${aluno.curso}`;
        infoDiv.style.color = '#006FB7';
      } else {
        foundIdInput.value = '';
        infoDiv.textContent = 'Nenhum aluno encontrado com esse nome.';
        infoDiv.style.color = '#d9534f';
      }
    } catch (erro) {
      console.error('Erro ao buscar aluno:', erro);
      alert('Erro ao buscar aluno. Verifique se o servidor está rodando.');
    }
  });

  // Excluir aluno
  formExcluir.addEventListener('submit', async function (e) {
    e.preventDefault();

    const foundId = foundIdInput.value.trim();

    if (!foundId) {
      alert('Busque um aluno antes de excluir.');
      return;
    }

    const confirmar = confirm('Tem certeza que deseja excluir este aluno?');
    if (!confirmar) return;

    try {
      await alunosAPI.deletar(foundId);
      alert('Aluno excluído com sucesso!');

      // Limpa o formulário
      queryInput.value = '';
      foundIdInput.value = '';
      infoDiv.textContent = '';

      // Redireciona
      window.location.href = 'bemVindoProf.html';
    } catch (erro) {
      console.error('Erro ao excluir aluno:', erro);
      alert(erro.message || 'Erro ao excluir aluno. Tente novamente.');
    }
  });
});
