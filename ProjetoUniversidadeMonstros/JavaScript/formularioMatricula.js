// Upload de foto
const inputFoto = document.getElementById('inputFoto');
const previewFoto = document.getElementById('previewFoto');
const iconUpload = document.getElementById('iconUpload');

// Quando uma foto é selecionada
inputFoto.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            previewFoto.src = event.target.result;
            previewFoto.style.display = 'block';
            document.getElementById('conteudoUpload').style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    } else {
        alert('Por favor, selecione uma imagem válida!');
    }
});

// Script para formatação de CPF
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

// Submissão do formulário
document.getElementById('formCadastroAluno').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const botao = this.querySelector('.botaoCadastrarAluno');
    const mensagemErro = document.getElementById('mensagemErro');
    
    // Desabilita o botão durante o cadastro
    botao.disabled = true;
    botao.textContent = 'Matriculando...';
    mensagemErro.textContent = '';
    
    // Coleta os dados do formulário
    const nomeAluno = document.getElementById('nomeAluno').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value;
    const sexo = document.getElementById('sexo').value;
    const curso = document.getElementById('curso').value;
    const turno = document.getElementById('turno').value;
    
    // Pega a foto (base64) do preview
    const foto = previewFoto.src && previewFoto.style.display !== 'none' ? previewFoto.src : null;
    
    // Validações
    if (nomeAluno.length < 3) {
        mensagemErro.textContent = 'O nome deve ter pelo menos 3 caracteres.';
        botao.disabled = false;
        botao.textContent = 'Matricular';
        return;
    }
    
    if (cpf.replace(/\D/g, '').length !== 11) {
        mensagemErro.textContent = 'CPF inválido. Digite 11 dígitos.';
        botao.disabled = false;
        botao.textContent = 'Matricular';
        return;
    }
    
    // Recupera alunos existentes do localStorage
    let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    
    // Verifica se o CPF já está cadastrado
    const cpfExiste = alunos.find(aluno => aluno.cpf === cpf);
    
    if (cpfExiste) {
        mensagemErro.textContent = 'Este CPF já está cadastrado.';
        botao.disabled = false;
        botao.textContent = 'Matricular';
        return;
    }
    
    // Gera um ID único para o aluno
    const id = Date.now().toString();
    
    // Formata a data de nascimento para exibição (DD/MM/AAAA)
    const dataFormatada = dataNascimento.split('-').reverse().join('/');
    
    // Mapeia o nome completo do curso
    const cursosMap = {
        'CienciasDoSusto': 'Bacharelado em Ciências do Susto',
        'EngenhariaDoTerror': 'Engenharia do Terror Aplicado',
        'IAParaAterrorizacao': 'Inteligência Artificial para Aterrorização'
    };
    
    // Cria o objeto do aluno
    const novoAluno = {
        id: id,
        nome: nomeAluno,
        dataNascimento: dataFormatada,
        cpf: cpf,
        sexo: sexo,
        curso: cursosMap[curso] || curso,
        turno: turno.charAt(0).toUpperCase() + turno.slice(1),
        foto: foto,
        dataMatricula: new Date().toISOString()
    };
    
    // Adiciona o novo aluno
    alunos.push(novoAluno);
    
    // Salva no localStorage
    localStorage.setItem('alunos', JSON.stringify(alunos));
    
    console.log('Aluno cadastrado:', novoAluno);
    console.log('Total de alunos:', alunos.length);
    
    // Feedback de sucesso
    alert('Aluno matriculado com sucesso!');
    
    // Limpar todos os campos do formulário
    document.getElementById('formCadastroAluno').reset();
    
    // Limpar a foto de preview
    previewFoto.style.display = 'none';
    previewFoto.src = '';
    document.getElementById('conteudoUpload').style.display = 'flex';
    inputFoto.value = '';
    
    // Reabilita o botão
    botao.disabled = false;
    botao.textContent = 'Matricular';
    
    // Limpa mensagem de erro
    mensagemErro.textContent = '';
});