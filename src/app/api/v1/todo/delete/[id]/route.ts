import { NextRequest, NextResponse } from "next/server";
import STATUS from "http-status";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const todo = await prisma.todo.delete({
    where: {
      id: id,
    },
  });

  if (!todo) {
    return NextResponse.json(
      {
        message: `Todo does not exist`,
      },
      { status: STATUS.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    {
      message: `ID: ${id} delete successfully!`,
    },
    { status: STATUS.OK }
  );
}
