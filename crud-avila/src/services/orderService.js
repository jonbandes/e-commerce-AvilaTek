import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Crea un nuevo pedido para un usuario autenticado.
 */

export const createOrder = async (userId, orderData) => {
    try {
      console.log("User ID:", userId);
      console.log("Order Data:", orderData);
  
      // Validaciones básicas
      if (!userId) {
        return { success: false, message: "El ID de usuario es requerido." };
      }
  
      const { products } = orderData;
  
      if (!products || !Array.isArray(products) || products.length === 0) {
        return { success: false, message: "El pedido debe contener al menos un producto válido." };
      }
  
      // Validar que todos los productos tienen `productId` y `quantity`
      for (const item of products) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          return {
            success: false,
            message: "Cada producto debe tener un ID válido y una cantidad mayor a 0.",
          };
        }
      }
  
      // Crear la orden con productos relacionados
      const order = await prisma.order.create({
        data: {
          userId,
          status: "PENDING", // Estado inicial del pedido
          orderItems: {
            create: products.map(({ productId, quantity }) => ({
              product: { connect: { id: productId } }, // Relación con Product
              quantity,
            })),
          },
        },
        include: { orderItems: true },
      });
  
      return {
        success: true,
        message: "Pedido creado exitosamente.",
        data: order,
      };
    } catch (error) {
      console.error("Error al crear el pedido:", error);
  
      // Manejo de errores específicos de Prisma
      if (error.code === "P2003") {
        return {
          success: false,
          message: "Error: Uno o más productos no existen en la base de datos.",
          error: error.message,
        };
      }
  
      return {
        success: false,
        message: "Error al crear el pedido.",
        error: error.message,
      };
    }
  };
  
/**
 * Obtiene el historial de pedidos de un usuario.
 */
export const getOrderHistory = async (userId) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Historial de pedidos obtenido correctamente.",
      data: orders,
    };
  } catch (error) {
    return { success: false, message: "Error al obtener historial de pedidos.", error: error.message };
  }
};

/**
 * Actualiza el estado de un pedido.
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return {
      success: true,
      message: "Estado del pedido actualizado.",
      data: order,
    };
  } catch (error) {
    return { success: false, message: "Error al actualizar estado del pedido.", error: error.message };
  }
};
