import * as usuariosService from "../services/usuariosService.js";

export async function cadastrar(req, res) {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({ erro: "Nome e senha são obrigatórios" });
        }

        // Verifica se usuário já existe
        const usuarioExiste = await usuariosService.buscarPorNome(nome);
        if (usuarioExiste) {
            return res.status(400).json({ erro: "Este usuário já existe" });
        }

        const novo = await usuariosService.criar({ nome, senha });
        res.status(201).json({ id: novo.id, nome: novo.nome });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

export async function login(req, res) {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).json({ erro: "Nome e senha são obrigatórios" });
        }

        const usuario = await usuariosService.autenticar(nome, senha);

        if (!usuario) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        res.json({ id: usuario.id, nome: usuario.nome });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}
