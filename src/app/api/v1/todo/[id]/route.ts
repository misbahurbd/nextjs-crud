import { editTodoSchema } from "@/app/validation/todo.validation";
import { errorHandler } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { SendResponse } from "@/lib/send-response";
import status from "http-status";
import { NextRequest, NextResponse } from "next/server";

// todo details
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
    return SendResponse({
      message: "Todo not found!",
      statusCode: status.NOT_FOUND,
    });
  }

  return NextResponse.json({
    message: `ID ${id} fetched successfully!`,
    data: todo,
  });
}

// edit todo
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const parsedData = editTodoSchema.parse(body);
    const { id } = await params;

    const todo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: parsedData,
    });

    if (!todo) {
      return NextResponse.json(
        {
          message: "Todo does not exist",
        },
        { status: status.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      {
        message: `ID: ${id} update successfully!`,
        data: todo,
      },
      { status: status.OK }
    );
  } catch (err) {
    return errorHandler(err);
  }
}

// delete todo
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
      { status: status.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    {
      message: `ID: ${id} delete successfully!`,
    },
    { status: status.OK }
  );
}
