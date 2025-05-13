import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      throw new Error("User does not exist!");
    }

    const isValidUser = user.password === password;
    if (!isValidUser) {
      throw new Error("Wrong password!");
    }

    return NextResponse.json({
      message: "Login success!",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message || "unable to login",
      },
      { status: 401 }
    );
  }
}
