import { NextRequest, NextResponse } from "next/server";
import STATUS from "http-status";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const { id } = await params;

  const todo = await prisma.todo.update({
    where: {
      id: id,
    },
    data: body,
  });

  if (!todo) {
    return NextResponse.json(
      {
        message: "Todo does not exist",
      },
      { status: STATUS.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    {
      message: `ID: ${id} update successfully!`,
      data: todo,
    },
    { status: STATUS.OK }
  );
}
