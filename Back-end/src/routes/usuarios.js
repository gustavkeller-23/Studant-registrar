import express from "express";
import * as usuariosController from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/cadastrar", usuariosController.cadastrar);
router.post("/login", usuariosController.login);

export default router;
