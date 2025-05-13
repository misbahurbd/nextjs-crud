import { NextResponse } from "next/server";
import STATUS from "http-status";
import { PrismaClient, Prisma, TodoStatus } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextResponse) {
  const { searchParams } = new URL(req.url);

  const sortBy = searchParams.get("sort-by") || "createdAt";
  const sortOrder = searchParams.get("sort-order") || "desc";

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
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

  return NextResponse.json(
    {
      message: "Todo data retrieve successfully!",
      total: count,
      page: page,
      limit: limit,
      data: todos,
    },
    {
      status: STATUS.OK,
    }
  );
}
