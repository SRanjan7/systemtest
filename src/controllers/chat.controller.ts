import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { timeStamp } from "console";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("chatFile");

export const uploadChatHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "error uploading file", error: err });
    }


    console.log('upload file',req.file);
    const workbook = XLSX.read(req.file?.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const chatHistory = XLSX.utils.sheet_to_json(sheet);
    console.log('chat file',chatHistory);
    // (chatHistory as any[])
    const validatedChats = chatHistory.map((chat: any) => {
        // if (!chat.username || !chat.message || !chat.timestamp) {
        //   return null;
        // }
        return {
          username: String(chat.UserName),
          message: String(chat.Message),
          timestamp: chat.Timestamp ? new Date(chat.Timestamp) : new Date(),
          status: chat.status || "pending",
        };
      })
      //   .filter((chat: any) => chat !== null);
      .filter(
        (
          item
        ): item is {
          username: string;
          message: string;
          timestamp: Date;
          status: string;
        } => item !== null
      );


      console.log('chat file',validatedChats);
    try {
      const createdChat = await prisma.chat.createMany({
        data: validatedChats,
      });
      res
        .status(200)
        .json({ message: "Chat history imported successfully", createdChat });
    } catch (error) {
      res.status(500).json({ message: "Error importing chat history", error });
    }
  });
};


export const getChatsByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.query;

  if (status && !["completed", "pending"].includes(status as string)) {
    res.status(400).json({ message: "Invalid filter status" });
    return;
  }
  try {
    const chats = status
      ? await prisma.chat.findMany({ where: { status: status as string } })
      : await prisma.chat.findMany();

    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};
