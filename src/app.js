import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import contasRoutes from "./routes/contas.routes.js";
import lancamentosRoutes from "./routes/lancamentos.routes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuariosRoutes);
app.use("/contas", contasRoutes);
app.use("/lancamentos", lancamentosRoutes);

// Rotas

export default app;
