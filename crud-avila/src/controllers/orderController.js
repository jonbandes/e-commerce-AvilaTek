import { createOrder, getOrderHistory, updateOrderStatus } from "../services/orderService.js";
import { BadRequestError } from "../utils/customErros.js";


/**
 * Endpoint para realizar un pedido.
 */
export const createOrderController = async (req, res) => {
  const userId = req.user.id; // Se asume que el usuario autenticado está en req.user
  const response = await createOrder(userId, req.body);

  if (!response.success) return res.status(400).json(response);
  return res.status(201).json(response);
};

/**
 * Endpoint para obtener el historial de pedidos de un usuario.
 */
export const getOrderHistoryController = async (req, res) => {
  const userId = req.user.id;
  const response = await getOrderHistory(userId);

  if (!response.success) return res.status(400).json(response);
  return res.status(200).json(response);
};

/**
 * Endpoint para actualizar el estado de un pedido.
 */
export const updateOrderStatusController = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const response = await updateOrderStatus(parseInt(orderId), status);
  if (!response.success) return res.status(400).json(response);
  return res.status(200).json(response);
};

/**
 * Endpoint para paginacion de pedidos.
 */
export const getPaginatedOrders = async (req, res) => {
    try {
      let { cursor, pageSize, userId } = req.query;
      pageSize = parseInt(pageSize) || 10;
  
      if (!userId) {
        //return res.status(400).json({ success: false, message: "Se requiere userId para filtrar los pedidos." });
        throw new BadRequestError("Se requiere userId para filtrar los pedidos." );
      }
  
      const orders = await prisma.order.findMany({
        where: { userId: parseInt(userId) },
        take: pageSize,
        cursor: cursor ? { id: parseInt(cursor) } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { id: "desc" }, // Ordenamos por los pedidos más recientes
        include: { orderItems: true },
      });
  
      const nextCursor = orders.length > 0 ? orders[orders.length - 1].id : null;
  
      res.json({
        success: true,
        orders,
        pagination: {
          nextCursor,
          pageSize,
          hasMore: !!nextCursor,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener pedidos", error: error.message });
    }
  };