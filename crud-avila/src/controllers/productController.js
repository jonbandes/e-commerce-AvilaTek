import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 
import * as productService from "../services/productService.js";
import { InternalServerError } from "../utils/customErros.js";

/**
 * Endpoint para obtener los productos disponibles en stock.
 */
export const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error obteniendo products: ', err);
        // Usamos la clase de error personalizada para errores 500
        next(new InternalServerError('Error interno al obtener productos'));
    }
};

/**
 * Endpoint para crear un producto.
 */
export const createProduct = async (req, res) => {
    try{
        const productData = req.body;
        console.log(productData);
        const newProduct = await productService.createProduct(productData);
        res.status(200).json(newProduct)
    } catch(err) {
        console.error('Error al intentar crear un producto: ',err);
        next(new InternalServerError('Error interno al obtener productos'));
    }
};

/**
 * Endpoint para actualizar un producto.
 */
export const updateProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        const productData = req.body;
        //console.log(productData)
        const updatedProduct = await productService.updateProduct(productData, productId);
        if(!updatedProduct) {
            throw new BadRequestError('Producto no encontrado');
        }
        res.status(200).json(updatedProduct);
    } catch(err) {
        console.error('Error creating product: ',err);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

/**
 * Endpoint para eliminar un producto.
 */
export const deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        //console.log(productData)
        const deletedProduct = await productService.deleteProduct(productId);
        if(!deletedProduct) {
            res.status(404).json({message: 'product no encontrado!'});
        }
        res.status(200).json(deletedProduct);
    } catch(err) {
        console.error('Error eliminando el producto: ',err);
        res.status(500).json({message: 'Error: Verifique si el Producto que intenta eliminar tiene alguna order asociada'});
    }
};


/**
 * Endpoint para la paginacion de productos.
 */
export const getPaginatedProducts = async (req, res) => {
    try {
      let { cursor, pageSize } = req.query;
      pageSize = parseInt(pageSize) || 5; // Tamaño de página por defecto: 5
      cursor = cursor ? parseInt(cursor) : null;
  
      console.log("Cursor recibido:", cursor);  
      console.log("PageSize:", pageSize);       
  
      // Consulta de productos con paginación
      const products = await prisma.product.findMany({
        take: pageSize + 1, // Tomamos uno extra para saber si hay más productos
        cursor: cursor ? { id: cursor } : undefined, // Empieza desde el cursor si existe
        orderBy: { id: "asc" }, // Ordenamos por id de forma ascendente
      });
  
      console.log("Productos encontrados:", products);  // Verifica qué productos se están obteniendo
  
      // Si hay más productos, devolver el siguiente cursor
      const nextCursor = products.length > pageSize ? products.pop().id : null;
  
      res.json({
        success: true,
        products: products.slice(0, pageSize), // Retornamos solo los productos solicitados
        pagination: {
          nextCursor,
          pageSize,
          hasMore: !!nextCursor, // Si hay un nextCursor, significa que hay más productos
        },
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);  // Muestra cualquier error
      res.status(500).json({ success: false, message: "Error al obtener productos", error: error.message });
    }
  };

  export default updateProduct;