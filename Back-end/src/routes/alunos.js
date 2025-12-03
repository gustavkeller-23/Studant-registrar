import express from "express";
import * as alunosController from "../controllers/alunosController.js";

const router = express.Router();

router.get("/", alunosController.listar);
router.get("/:id", alunosController.buscarPorId);
router.get("/cpf/:cpf", alunosController.buscarPorCpf);
router.post("/", alunosController.criar);
router.put("/:id", alunosController.atualizar);
router.delete("/:id", alunosController.deletar);

export default router;
