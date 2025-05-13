import { NextRequest, NextResponse } from "next/server";
import STATUS from "http-status";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(
    {
      message: "Todo created successfully!",
      data: todo,
    },
    {
      status: STATUS.CREATED,
    }
  );
}