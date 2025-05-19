import { errorHandler } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { SendResponse } from "@/lib/send-response";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const queryParams = Object.fromEntries(searchParams) as {
    page?: string;
    limit?: string;
  };

  const page = queryParams.page ? parseInt(queryParams.page) : 1;
  const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;
  const skip = limit * (page - 1);

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
      },
      take: limit,
      skip,
    });

    const totalUsers = await prisma.user.count();

    return SendResponse({
      message: "User list fetched successfully!",
      total: totalUsers,
      limit,
      page,
      data: users,
    });
  } catch (err) {
    errorHandler(err);
  }
};
