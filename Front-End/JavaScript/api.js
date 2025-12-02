// Módulo centralizado para chamadas à API
const API_BASE_URL = 'http://localhost:3000';

// Função helper para fazer requests
async function request(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro na requisição');
        }

        // Para DELETE, retorna null
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        throw erro;
    }
}

// API de Alunos
export const alunosAPI = {
    // Listar todos os alunos com filtros opcionais
    listar: async (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.turno) params.append('turno', filtros.turno);
        if (filtros.curso) params.append('curso', filtros.curso);

        const query = params.toString();
        return request(`/alunos${query ? `?${query}` : ''}`);
    },

    // Buscar aluno por ID
    buscarPorId: async (id) => {
        return request(`/alunos/${id}`);
    },

    // Buscar aluno por CPF
    buscarPorCpf: async (cpf) => {
        try {
            return await request(`/alunos/cpf/${cpf}`);
        } catch (erro) {
            if (erro.message === 'Aluno não encontrado') {
                return null;
            }
            throw erro;
        }
    },

    // Criar novo aluno
    criar: async (dados) => {
        return request('/alunos', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    // Atualizar aluno
    atualizar: async (id, dados) => {
        return request(`/alunos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
    },

    // Deletar aluno
    deletar: async (id) => {
        return request(`/alunos/${id}`, {
            method: 'DELETE'
        });
    }
};

// API de Usuários
export const usuariosAPI = {
    // Cadastrar novo usuário
    cadastrar: async (nome, senha) => {
        return request('/usuarios/cadastrar', {
            method: 'POST',
            body: JSON.stringify({ nome, senha })
        });
    },

    // Fazer login
    login: async (nome, senha) => {
        return request('/usuarios/login', {
            method: 'POST',
            body: JSON.stringify({ nome, senha })
        });
    }
};
