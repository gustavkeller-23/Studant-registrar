import { usuariosAPI } from './api.js';

// Script para cadastro de usuário
document.querySelector('.formEntrar').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value;

  if (!nome || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  try {
    await usuariosAPI.cadastrar(nome, senha);

    alert('Cadastro realizado com sucesso! Faça login para continuar.');

    // Redireciona para a tela de login
    window.location.href = 'TelaLogin.html';
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    alert(erro.message || 'Erro ao cadastrar. Tente novamente.');
  }
});