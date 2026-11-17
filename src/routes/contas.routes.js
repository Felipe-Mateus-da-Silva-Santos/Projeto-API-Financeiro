import express from "express";

import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
} from "../controllers/contas.controller.js";

const router = express.Router();

// READ
router.get("/", listar);
router.get("/:id", buscarPorId);

// CREATE
router.post("/", criar);

// UPDATE
router.put("/:id", atualizar);

// DELETE
router.delete("/:id", excluir);

export default router;
