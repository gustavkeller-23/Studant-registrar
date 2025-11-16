// telaLoginRedirecionamento.js

document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const botao = this.querySelector('.botaoEntrar');
  const mensagemErro = document.getElementById('mensagemErro');
  
  // Desabilita o botão e limpa mensagens anteriores
  botao.disabled = true;
  botao.textContent = 'Entrando...';
  mensagemErro.classList.remove('ativo');

  // Coleta os dados do formulário
  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value;

  // Simulação de delay para parecer uma requisição real
  setTimeout(() => {
    // Usuários padrão do sistema
    const usuariosPadrao = [
      { usuario: 'admin', senha: 'admin123' },
      { usuario: 'professor', senha: 'prof123' }
    ];

    // Recupera usuários cadastrados do localStorage
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Combina usuários padrão com cadastrados
    const todosUsuarios = [...usuariosPadrao, ...usuariosCadastrados];

    // Verifica se as credenciais estão corretas
    const usuarioEncontrado = todosUsuarios.find(
      u => u.usuario === nome && u.senha === senha
    );

    if (usuarioEncontrado) {
      // Login bem-sucedido
      sessionStorage.setItem('usuarioLogado', nome);
      
      // Redireciona
      window.location.href = 'bemVindoProf.html';
    } else {
      // Falha no login - exibe mensagem de erro
      mensagemErro.textContent = 'Usuário ou senha incorretos.';
      mensagemErro.classList.add('ativo');
      
      // Reabilita o botão
      botao.disabled = false;
      botao.textContent = 'Entrar';
    }
  }, 500);
});