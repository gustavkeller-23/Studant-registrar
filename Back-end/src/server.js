import express from "express";
import cors from "cors";
import alunosRoutes from "./routes/alunos.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentado para suportar imagens em base64
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/alunos", alunosRoutes);
app.use("/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
