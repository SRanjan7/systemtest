import express from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';


dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);



export default app;