import * as alunosService from "../services/alunosService.js";

export async function listar(req, res) {
  try {
    const { nome, turno, curso } = req.query;
    const filtros = {};

    if (nome) filtros.nome = nome;
    if (turno) filtros.turno = turno;
    if (curso) filtros.curso = curso;

    const alunos = await alunosService.listar(filtros);
    res.json(alunos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function buscarPorId(req, res) {
  try {
    const aluno = await alunosService.buscarPorId(req.params.id);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
    res.json(aluno);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function buscarPorCpf(req, res) {
  try {
    const aluno = await alunosService.buscarPorCpf(req.params.cpf);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
    res.json(aluno);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function criar(req, res) {
  try {
    const { nome, dataNascimento, cpf, sexo, curso, turno, foto } = req.body;

    // Validações
    if (!nome || !dataNascimento || !cpf || !sexo || !curso || !turno) {
      return res.status(400).json({ erro: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    // Verifica se CPF já existe
    const cpfExiste = await alunosService.buscarPorCpf(cpf);
    if (cpfExiste) {
      return res.status(400).json({ erro: "Este CPF já está cadastrado" });
    }

    const novo = await alunosService.criar(req.body);
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function atualizar(req, res) {
  try {
    const aluno = await alunosService.buscarPorId(req.params.id);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });

    const atualizado = await alunosService.atualizar(req.params.id, req.body);
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

export async function deletar(req, res) {
  try {
    const aluno = await alunosService.buscarPorId(req.params.id);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });

    await alunosService.deletar(req.params.id);
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}
