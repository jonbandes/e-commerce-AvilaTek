import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register); // registra un nuevo user
router.post('/login', login); // logea un usuario

export default router;