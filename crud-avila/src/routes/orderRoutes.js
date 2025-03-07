import express from "express";
import {
  createOrderController,
  getOrderHistoryController,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

import { getPaginatedOrders } from "../controllers/orderController.js";
const router = express.Router();

router.post("/order", authenticateUser, createOrderController); // Crear pedido
router.get("/orders", authenticateUser, getOrderHistoryController); // Ver historial
router.get("/orders/paginated", authenticateUser, getPaginatedOrders); // Paginacion de pedidos
router.put("/:orderId", authenticateUser, updateOrderStatusController); // Actualizar estado

export default router;
