import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function listar(filtros = {}) {
  const where = {};
  
  if (filtros.turno) where.turno = filtros.turno;
  if (filtros.curso) where.curso = filtros.curso;
  if (filtros.nome) {
    where.nome = {
      contains: filtros.nome,
      mode: 'insensitive'
    };
  }
  
  return prisma.aluno.findMany({ where });
}

export function buscarPorId(id) {
  return prisma.aluno.findUnique({ where: { id } });
}

export function buscarPorCpf(cpf) {
  return prisma.aluno.findUnique({ where: { cpf } });
}

export function buscarPorNome(nome) {
  return prisma.aluno.findMany({
    where: {
      nome: {
        contains: nome,
        mode: 'insensitive'
      }
    }
  });
}

export function criar(data) {
  return prisma.aluno.create({ data });
}

export function atualizar(id, data) {
  return prisma.aluno.update({ where: { id }, data });
}

export function deletar(id) {
  return prisma.aluno.delete({ where: { id } });
}
