import { Router  } from "express";
import { uploadChatHistory, getChatsByStatus } from "../controllers/chat.controller";

import { verifyToken } from "../middlewares/verifyToken"; 


const router = Router();

router.post("/upload-chat", verifyToken, uploadChatHistory);
router.get("/getChats", verifyToken,getChatsByStatus);


export default router;