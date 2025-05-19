import { Prisma } from "@/generated/prisma";
import { SendResponse } from "@/lib/send-response";
import status from "http-status";
import { ZodError } from "zod";

export const errorHandler = (err: unknown) => {
  let message: string = "Internal server error";
  let statusCode: number = status.INTERNAL_SERVER_ERROR;

  if (err instanceof ZodError) {
    message = err.issues.map(error => error.message).join(", ");
    statusCode = status.BAD_REQUEST;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = "Prisma";
  }

  return SendResponse({
    message,
    statusCode,
  });
};
