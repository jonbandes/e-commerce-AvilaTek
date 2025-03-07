import express from 'express';
import { getProducts, createProduct, getPaginatedProducts, deleteProduct } from '../controllers/productController.js';
import updateProduct from '../controllers/productController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/products', authenticateUser, getProducts); //ver prouctos
router.post('/product', authenticateUser, createProduct); // crear un producto
router.put('/product/:id', authenticateUser, updateProduct); // actualizar la info de un producto dado su ID
router.delete('/product/:id', authenticateUser, deleteProduct); //eliminar un producto dado su ID

router.get("/products/paginated", authenticateUser, getPaginatedProducts); // paginacion para obtener los productos seccionados

export default router;