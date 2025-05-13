import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import STATUS from "http-status";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: id,
    },
  });
  if (!todo) {
    return NextResponse.json(
      {
        message: `Todo not found`,
      },
      {
        status: STATUS.NOT_FOUND,
      }
    );
  }

  return NextResponse.json({
    message: `ID ${id} fetched successfully!`,
    data: todo,
  });
}
