import prisma from "../db.js";
/**
 * Obtiene los productos disponibles.
 */
export const getProducts = async () => {
    try {
        return await prisma.product.findMany({
            where: { inStock: true } // filtro para obtener los productos disponibles
        }
        );
    } catch (err) {
        console.error("Error fetching products:", err);
        throw new Error("Failed to fetch products");
    }
};

/**
 * Funcion para crear un producto.
 */
export const createProduct = async (productData) => {
    const { name, description, price, inStock } = productData;
  
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          inStock,
        },
      });
  
      return {
        success: true,
        message: "Producto creado exitosamente",
        data: product,
      };
    } catch (error) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "El nombre del producto ya existe. POr favor use otro nombre.",
          duplicatedField: "name",
        };
      }
  
      return {
        success: false,
        message: "Error al crear el producto.",
        error: error.message,
      };
    }
  };


  /**
 * Funcion para actualizar un producto.
 */
export const updateProduct = async (productData, productId) => {
    const { name, description, price, inStock } = productData;

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) }, // Aseguramos que sea un número
            data: { name, description, price, inStock },
        });

        return {
            success: true,
            message: "Producto actualizado correctamente",
            data: updatedProduct,
        };
    } catch (err) {
        console.error("Error actualizando el producto:", err);

        // Manejamos el error específico de Prisma
        if (err.code === 'P2025') {
            throw new Error("Producto no encontrado");
        }
        if (err.code === 'P2002') {
            throw new Error("El nombre del producto ya está en uso");
        }

        // Lanzamos un error genérico si no es específico
        throw new Error("Falla al actualizar producto");
    }
};

/**
 * Funcion para eliminar un producto.
 */

export const deleteProduct = async (productId) => {  // No necesitas productData para eliminar
    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(productId) }, // Aseguramos que el ID sea un número
        });

        return {
            success: true,
            message: "Producto eliminado correctamente", // Mensaje ajustado para eliminar
            data: deletedProduct,
        };
    } catch (err) {
        console.error("Error eliminando el producto:", err);

        // Manejo de errores específicos de Prisma
        if (err.code === "P2025") { // Código de error cuando el registro no existe
            return {
                success: false,
                message: "El producto no existe o ya fue eliminado.",
            };
        }

        throw new Error("Falla al eliminar el producto"); // Error genérico
    }
};
