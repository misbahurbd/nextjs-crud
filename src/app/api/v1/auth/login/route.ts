import { loginSchema } from "@/app/validation/auth.validation";
import { errorHandler } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { SendResponse } from "@/lib/send-response";
import status from "http-status";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { addDays } from "date-fns";

export const POST = async (req: NextRequest) => {
  try {
    const cookie = await cookies();
    const body = await req.json();
    const parsedData = loginSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        OR: ["username", "email"].map(field => ({
          [field]: {
            equals: parsedData.username,
            mode: "insensitive",
          },
        })),
      },
    });

    if (!user) {
      return SendResponse({
        message: "Invalid credentials",
        statusCode: status.UNAUTHORIZED,
      });
    }

    const isValidPassword = await bcrypt.compare(
      parsedData.password,
      user.password
    );
    if (!isValidPassword) {
      return SendResponse({
        message: "Invalid credentials",
        statusCode: status.UNAUTHORIZED,
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "7d",
        audience: ["user"],
      }
    );

    cookie.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: addDays(new Date(), 7),
      sameSite: "lax",
    });

    return NextResponse.json(
      { message: "Login success" },
      {
        status: status.OK,
      }
    );
  } catch (err) {
    return errorHandler(err);
  }
};
