import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function buscarPorNome(nome) {
    return prisma.usuario.findUnique({ where: { nome } });
}

export function criar(data) {
    return prisma.usuario.create({ data });
}

export function autenticar(nome, senha) {
    return prisma.usuario.findFirst({
        where: {
            nome,
            senha
        }
    });
}
