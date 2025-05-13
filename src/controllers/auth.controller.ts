import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";
import { error } from "console";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "User alredy exist" });
      return;
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
     
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
