// telaCadastro.js

document.querySelector('.formEntrar').addEventListener('submit', function (e) {
  e.preventDefault();

  const botao = this.querySelector('.botaoEntrar');
  
  // Desabilita o botão durante o cadastro
  botao.disabled = true;
  botao.textContent = 'Cadastrando...';

  // Coleta os dados do formulário
  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value;

  // Validações
  if (nome.length < 3) {
    alert('O nome de usuário deve ter pelo menos 3 caracteres.');
    botao.disabled = false;
    botao.textContent = 'Cadastrar';
    return;
  }

  if (senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    botao.disabled = false;
    botao.textContent = 'Cadastrar';
    return;
  }

  // Recupera usuários existentes do localStorage
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se o usuário já existe
  const usuarioExiste = usuarios.find(u => u.usuario === nome);

  if (usuarioExiste) {
    alert('Este nome de usuário já está cadastrado. Escolha outro.');
    botao.disabled = false;
    botao.textContent = 'Cadastrar';
    return;
  }

  // Adiciona o novo usuário
  usuarios.push({
    usuario: nome,
    senha: senha,
    dataCadastro: new Date().toISOString()
  });

  // Salva no localStorage
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Feedback de sucesso
  alert('Cadastro realizado com sucesso! Redirecionando para o login...');

  // Redireciona para a tela de login após 1 segundo
  setTimeout(() => {
    window.location.href = 'TelaLogin.html';
  }, 1000);
});