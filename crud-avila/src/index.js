import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

import orderRoutes from './routes/orderRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
    console.log("listening on pot 3000")
});