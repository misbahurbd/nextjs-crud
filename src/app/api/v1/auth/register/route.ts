import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .trim()
    .email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be 6 letter or longer"),
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const createdUser = await prisma.user.create({
      data: data,
    });

    if (!createdUser) {
      throw new Error("Unable to create user");
    }

    return NextResponse.json(
      {
        message: createdUser,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        err: err,
      },
      {
        status: 500,
      }
    );
  }
}
