import express from "express";

import {
  listar,
  buscarPorId,
  criar,
  total,
} from "../controllers/lancamentos.controller.js";

const router = express.Router();

// CREATE
router.post("/", criar);

// READ
router.get("/", listar);
router.get("/total", total);
router.get("/:id", buscarPorId);

export default router;
