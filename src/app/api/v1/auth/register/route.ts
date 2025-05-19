import { registerSchema } from "@/app/validation/auth.validation";
import { errorHandler } from "@/lib/error-handler";
import prisma from "@/lib/prisma";
import { SendResponse } from "@/lib/send-response";
import status from "http-status";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

const isUsernameExist = async (username: string): Promise<boolean> => {
  const isExist = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  return !!isExist; // if exist return true | if not exist return false
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsedData = registerSchema.parse(body);

    const isExist = await prisma.user.findFirst({
      where: {
        email: {
          equals: parsedData.email,
          mode: "insensitive",
        },
      },
    });

    if (isExist) {
      return SendResponse({
        message: "User already exist",
        statusCode: status.BAD_REQUEST,
      });
    }

    const baseUsername = parsedData.name.replace(/\s+/g, "").slice(0, 10);

    let username = baseUsername;
    while (await isUsernameExist(username)) {
      username = `${baseUsername}-${crypto.randomUUID().slice(0, 4)}`;
    }

    const hashedPassword = await bcrypt.hash(
      parsedData.password,
      Number(process.env.SALT_ROUND!)
    );

    const user = await prisma.user.create({
      data: {
        ...parsedData,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });

    return SendResponse({
      message: "User register successfully!",
      data: user,
      statusCode: status.CREATED,
    });
  } catch (err) {
    return errorHandler(err);
  }
};
