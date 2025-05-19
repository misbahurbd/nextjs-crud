import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import STATUS from "http-status";
import { Prisma, TodoStatus } from "@/generated/prisma";
import { createTodoScheme } from "@/app/validation/todo.validation";
import { SendResponse } from "@/lib/send-response";
import { errorHandler } from "@/lib/error-handler";

// create todo route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = createTodoScheme.parse(body);

    const todo = await prisma.todo.create({
      data: parsedData,
    });

    return SendResponse({
      message: "Todo created successfully",
      data: todo,
      statusCode: STATUS.OK,
    });
  } catch (err) {
    return errorHandler(err);
  }
}

// get all todo
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const sortBy = searchParams.get("sort-by") || "createdAt";
    const sortOrder = searchParams.get("sort-order") || "desc";

    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10;
    const skip = limit * (page - 1);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Prisma.TodoWhereInput = {};

    if (status) {
      filter.status = status as TodoStatus;
    }

    if (search) {
      filter.OR = ["title", "description"].map(field => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      }));
    }

    const todos = await prisma.todo.findMany({
      where: filter,
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const count = await prisma.todo.count({ where: filter });

    return SendResponse({
      message: "Todo data retrieve successfully!",
      total: count,
      page: page,
      limit: limit,
      data: todos,
    });
  } catch (err) {
    return errorHandler(err);
  }
}