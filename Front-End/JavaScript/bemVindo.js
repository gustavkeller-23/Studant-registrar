document.addEventListener('DOMContentLoaded', function() {
    // 1. Recupera a string salva no Login
    const storageData = sessionStorage.getItem('usuarioLogado');

    // 2. Elemento onde vamos escrever o nome
    const nomeDisplay = document.getElementById('nomeUsuario');

    if (storageData) {
        // 3. Converte de volta para Objeto JSON
        const usuario = JSON.parse(storageData);

        // 4. Se tiver nome, atualiza a tela
        if (usuario.nome && nomeDisplay) {
            // .toUpperCase() deixa em caixa alta para ficar bonito no título
            nomeDisplay.textContent = usuario.nome.toUpperCase();
        }
    } else {
        // Opcional: Se não tiver ninguém logado, manda voltar pro login
        // window.location.href = 'TelaLogin.html';
        console.warn('Nenhum usuário logado encontrado no sessionStorage.');
    }
});