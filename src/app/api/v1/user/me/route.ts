import { errorHandler } from "@/lib/error-handler";
import { SendResponse } from "@/lib/send-response";
import status from "http-status";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface Payload {
  id: string;
  name: string;
  email: string;
  username: string;
}

export const GET = async () => {
  try {
    const cookie = await cookies();
    const token = cookie.get("accessToken");
    if (!token?.value) {
      return SendResponse({
        message: "Unauthorized",
        statusCode: status.UNAUTHORIZED,
      });
    }

    const payload = jwt.verify(
      token.value,
      process.env.ACCESS_TOKEN_SECRET!
    ) as Payload;
    if (!payload) {
      return SendResponse({
        message: "Unauthorized",
        statusCode: status.UNAUTHORIZED,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return SendResponse({
        message: "Invalid access token",
        statusCode: status.UNAUTHORIZED,
      });
    }

    return SendResponse({
      message: "Current user fetched successfully!",
      data: user,
    });
  } catch (err) {
    errorHandler(err);
  }
};
