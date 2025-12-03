import { usuariosAPI } from './api.js';

// Evento de submissão do formulário de login
document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value;
  const mensagemErro = document.getElementById('mensagemErro');

  // Limpa mensagem de erro anterior
  mensagemErro.textContent = '';
  mensagemErro.classList.remove('ativo');

  if (!nome || !senha) {
    mensagemErro.textContent = 'Por favor, preencha todos os campos.';
    mensagemErro.classList.add('ativo');
    return;
  }

  try {
    const usuario = await usuariosAPI.login(nome, senha);

    // Salva informações do usuário no sessionStorage
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    // Redireciona para a página de boas-vindas
    window.location.href = 'bemVindoProf.html';
  } catch (erro) {
    console.error('Erro no login:', erro);
    mensagemErro.textContent = erro.message || 'Usuário ou senha incorretos.';
    mensagemErro.classList.add('ativo');
  }
});